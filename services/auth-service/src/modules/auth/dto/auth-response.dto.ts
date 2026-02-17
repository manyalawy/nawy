export class UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

export class RefreshTokenDto {
  accessToken: string;
  expiresIn: number;
}
