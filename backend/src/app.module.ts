import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditorGateway } from './editor.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EditorGateway],
})
export class AppModule {}
