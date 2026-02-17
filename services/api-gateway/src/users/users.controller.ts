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
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class UsersController {
  private readonly authServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
  }

  @Post('register')
  @Public()
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT tokens' })
  async login(@Body() dto: LoginDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, dto),
      );
      return response.data;
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
  async getMe(@Request() req: { user: { id: string }; headers: { authorization?: string } }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/me`, {
          headers: {
            Authorization: req.headers.authorization,
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

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/refresh`, { refreshToken }),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      throw new HttpException(
        err.response?.data || 'Token refresh failed',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
