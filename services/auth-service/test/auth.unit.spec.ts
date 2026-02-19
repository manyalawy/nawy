import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/prisma.service';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // Mock user data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock Prisma service
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  // Mock JWT service
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: registerDto.email,
        name: registerDto.name,
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.email).toBe(registerDto.email);
      expect(result.data.name).toBe(registerDto.name);
      expect(result.data).not.toHaveProperty('password');
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should hash the password before storing', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      await service.register(registerDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: 'hashedPassword',
          name: registerDto.name,
        },
      });
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('accessToken123');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBe('accessToken123');
      expect(result.data.expiresIn).toBe(3600);
      expect(result.data.user.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should generate token with correct payload', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.login(loginDto);

      // Assert
      const expectedPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, {
        expiresIn: '1h',
      });
    });
  });

  describe('getMe', () => {
    it('should return user data when user exists', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.getMe(mockUser.id);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(mockUser.id);
      expect(result.data.email).toBe(mockUser.email);
      expect(result.data).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMe('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.getMe('nonexistent-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data when user exists', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser(mockUser.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(mockUser.id);
      expect(result?.email).toBe(mockUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('nonexistent-id');

      // Assert
      expect(result).toBeNull();
    });
  });
});
