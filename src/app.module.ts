import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.api.module';
import { OrmModule } from './database/orm.module';
import { ConfigModule } from '@nestjs/config';
import config from './database/config/config';
import { RestaurantModule } from './modules/restaurant/restaurant.api.module';
import { MulterModule } from '@nestjs/platform-express';
import { FILE_UPLOADS_DIR } from './constants';
import { diskStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    OrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET_KEY,
      signOptions: { expiresIn: '300s' },
    }),
    AuthModule, RestaurantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
