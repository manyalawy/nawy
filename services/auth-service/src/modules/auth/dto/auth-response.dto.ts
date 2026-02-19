export class UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;
  expiresIn: number;
  user: UserDto;
}
