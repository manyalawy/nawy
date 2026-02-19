import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 1000, // 1 hour
  path: '/',
};

@ApiTags('Authentication')
@Controller('auth')
export class UsersController {
  private readonly authServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
  }

  @Post('register')
  @Public()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/register`, dto),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Registration failed',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @Public()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, dto),
      );
      const { accessToken, user, expiresIn } = response.data.data;

      res.cookie('accessToken', accessToken, COOKIE_OPTIONS);

      return {
        success: true,
        data: { user, expiresIn },
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Login failed',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Request() req: { user: { id: string }; cookies: { accessToken?: string } }) {
    try {
      const token = req.cookies?.accessToken;
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Failed to get user',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear authentication cookie' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
