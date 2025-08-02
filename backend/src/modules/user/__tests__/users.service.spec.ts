import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    userId: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    role: Role.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResponseUser = {
    userId: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    role: Role.STUDENT,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'valid-password-123',
        role: Role.ADMIN,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          passwordHash: 'hashedPassword',
          role: createUserDto.role,
        }),
      });
      expect(result).toEqual(mockResponseUser);
    });

    it('should throw BadRequestException when password is missing', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        role: Role.STUDENT,
      } as CreateUserDto;

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'exists@example.com',
        password: 'password123',
        role: Role.STUDENT,
      };

      // Mock bcrypt hash to avoid actual hashing
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Mock Prisma error with more realistic error object
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        {
          code: 'P2002',
          clientVersion: '2.0.0',
          meta: {
            target: ['email'],
          },
        },
      );
      (prismaService.user.create as jest.Mock).mockRejectedValue(prismaError);

      // Test the error and message
      try {
        await service.createUser(createUserDto);
        fail('Should have thrown ConflictException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User with this email already exists');
      }

      // Verify create was called with correct data
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          passwordHash: 'hashedPassword',
          role: createUserDto.role,
        },
      });

      // Verify bcrypt was called
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser, { ...mockUser, userId: '2' }];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.findAllUsers();

      expect(result).toEqual(
        mockUsers.map((user) => ({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findUserById('1');

      expect(result).toEqual(mockResponseUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findUserById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user', async () => {
      const updateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.updateUser('1', updateUserDto);

      expect(result).toEqual({
        ...mockResponseUser,
        ...updateUserDto,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { userId: '1' },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateUser('999', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a non-admin user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.delete as jest.Mock).mockResolvedValue(mockUser);

      await service.deleteUser('1');

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });

    it('should throw ForbiddenException when trying to delete an admin', async () => {
      const adminUser = { ...mockUser, role: Role.ADMIN };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(adminUser);

      await expect(service.deleteUser('1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUser('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found by email', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });
});
