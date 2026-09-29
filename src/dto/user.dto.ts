export interface SignupDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
}
