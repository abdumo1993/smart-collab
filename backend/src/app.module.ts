import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocsModule } from './docs/docs.module';
import { GitModule } from './git/git.module';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat/chat.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DocsModule,
    GitModule,
    AiModule,
    
    ChatModule,
    WebsocketModule,
    SharedModule,
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
