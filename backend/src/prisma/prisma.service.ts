// backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma'; 

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Optional: Enable query logging
    });
  }

  async onModuleInit() {
    await this.$connect(); // Connect to the database when the module initializes
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect when the module is destroyed (e.g., app shutdown)
  }
}
