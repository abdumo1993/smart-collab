import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { IUsersService } from '@/modules/__interfaces__/user.service.interface';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos';
import {
  PaginatedResponse,
  PaginationData,
} from '@/common/response/api-response.dto';
import { EmailService } from '../shared/email.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService implements IUsersService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private mapToResponse(user: User): UserResponseDto {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phoneNumber: user.phone ?? '',
    };
  }

  async createUser(
    createUserDto: CreateUserDto,
    creatorRole?: Role,
  ): Promise<UserResponseDto> {
    try {
      // Only allow ADMIN creation by an authenticated admin
      if (createUserDto.role === Role.ADMIN && creatorRole !== Role.ADMIN) {
        throw new ForbiddenException('Only admins can create another admin');
      }
      // Validate required fields
      const { password, ...rest } = createUserDto;
      if (!createUserDto.role) {
        throw new ConflictException(
          'Error creating a new user: Role is required',
        );
      }
      if (!password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate email confirmation token
      const emailConfirmationToken =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      try {
        const user = await this.prismaService.user.create({
          data: {
            ...rest,
            password: hashedPassword,
            isEmailConfirmed: false,
            emailConfirmationToken,
          },
        });
        // Send confirmation email
        await this.emailService.sendEmailConfirmation(
          user.email,
          emailConfirmationToken,
        );
        this.logger.log(`User created successfully: ${user.email}`);
        return this.mapToResponse(user);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException('User with this email already exists');
        }
        this.logger.error(`Failed to create user: ${error.message}`);
        throw error;
      }
    } catch (error) {
      this.logger.error(`User creation failed: ${error.message}`);
      throw error;
    }
  }

  async isFirstUser(): Promise<boolean> {
    const count = await this.prismaService.user.count();
    return count === 0;
  }

  async findAllUsers(
    page = 1,
    size = 10,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    // pagination logic
    const skip = (page - 1) * size;
    const [users, totalItems] = await Promise.all([
      this.prismaService.user.findMany({
        skip: skip,
        take: size,
        orderBy: [{ firstName: 'asc' }],
      }),
      this.prismaService.user.count(),
    ]);

    const userDtos = users.map((user) => this.mapToResponse(user));
    const totalPages = Math.ceil(totalItems / size);
    const paginationData: PaginationData = {
      totalItems: totalItems,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: size,
    };

    return new PaginatedResponse<UserResponseDto>(userDtos, paginationData);
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.mapToResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.findUserById(id);
      if (!user) throw new NotFoundException('User not found');

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      return this.mapToResponse(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`User with this email already exists`);
        } else if (error.code === 'P2025') {
          throw new NotFoundException(error.meta?.cause ?? 'User not found');
        } else {
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
        }
      } else {
        throw error;
      }
    }
  }

  async deleteUser(adminId: string, userId: string): Promise<void> {
    // Only allow admins to delete users
    // (You may want to add more logic here for your use case)
    await this.prismaService.user.delete({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findOrCreateUserByOAuth(
    oauthProfile: {
      email: string;
      firstName: string;
      lastName: string;
      providerId: string;
    },
    provider: string,
  ): Promise<UserResponseDto> {
    try {
      // First, try to find existing user by email
      let user = await this.findByEmail(oauthProfile.email);

      if (user) {
        // User exists, check if OAuth account is linked
        const existingOAuthAccount =
          await this.prismaService.oAuthAccount.findFirst({
            where: {
              userId: user.id,
              provider,
              providerAccountId: oauthProfile.providerId,
            },
          });

        if (!existingOAuthAccount) {
          // Link the OAuth account to existing user
          await this.prismaService.oAuthAccount.create({
            data: {
              provider,
              providerAccountId: oauthProfile.providerId,
              userId: user.id,
            },
          });
          this.logger.log(
            `OAuth account linked to existing user: ${user.email}`,
          );
        }
      } else {
        // Create new user with OAuth data
        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36).substring(2) + Date.now().toString(36),
          10,
        );

        user = await this.prismaService.user.create({
          data: {
            email: oauthProfile.email,
            firstName: oauthProfile.firstName,
            lastName: oauthProfile.lastName,
            password: hashedPassword,
            role: Role.CONSUMER, // Default role for OAuth users
            isEmailConfirmed: true, // OAuth users are pre-verified
          },
        });

        // Create OAuth account link
        await this.prismaService.oAuthAccount.create({
          data: {
            provider,
            providerAccountId: oauthProfile.providerId,
            userId: user.id,
          },
        });

        this.logger.log(`New user created via OAuth: ${user.email}`);
      }

      return this.mapToResponse(user);
    } catch (error) {
      this.logger.error(`OAuth user creation/linking failed: ${error.message}`);
      throw error;
    }
  }

  // Email confirmation
  async confirmEmail(token: string): Promise<void> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { emailConfirmationToken: token },
      });
      if (!user)
        throw new NotFoundException('Invalid or expired confirmation token');

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          isEmailConfirmed: true,
          emailConfirmationToken: null,
        },
      });
      this.logger.log(`Email confirmed for user: ${user.email}`);
    } catch (error) {
      this.logger.error(`Email confirmation failed: ${error.message}`);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) return; // Don't reveal if user exists

      const token =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expires,
        },
      });
      // Send password reset email
      await this.emailService.sendPasswordReset(user.email, token);
      this.logger.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error(
        `Forgot password failed for ${email}: ${error.message}`,
      );
      // Don't throw error to avoid revealing if user exists
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { gte: new Date() },
        },
      });
      if (!user) throw new NotFoundException('Invalid or expired reset token');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
      this.logger.log(`Password reset successful for user: ${user.email}`);
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`);
      throw error;
    }
  }

  // Get OAuth accounts for a user
  async getOAuthAccounts(userId: string): Promise<any[]> {
    const accounts = await this.prismaService.oAuthAccount.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        createdAt: true,
      },
    });
    return accounts;
  }

  // Unlink OAuth account
  async unlinkOAuthAccount(userId: string, provider: string): Promise<void> {
    await this.prismaService.oAuthAccount.deleteMany({
      where: {
        userId,
        provider,
      },
    });
    this.logger.log(`OAuth account unlinked: ${userId} via ${provider}`);
  }
}
