import { type PaginatedResponse } from '@/common/response/api-response.dto';
import {
  type CreateUserDto,
  type UpdateUserDto,
  type UserResponseDto,
} from '../user/dtos';
import { Role, type User } from '@prisma/client';

export interface IUsersService {
  deleteUser(adminId: string, userId: string): Promise<void>;
  findAllUsers(
    page: number,
    size: number,
  ): Promise<PaginatedResponse<UserResponseDto>>;
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<UserResponseDto>;
  createUser(
    createUserDto: CreateUserDto,
    creatorRole?: Role,
  ): Promise<UserResponseDto>;
  updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto>;
  confirmEmail(token: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  findOrCreateUserByOAuth(
    oauthProfile: {
      email: string;
      firstName: string;
      lastName: string;
      providerId: string;
    },
    provider: string,
  ): Promise<UserResponseDto>;
}
