import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.api.module';
import { OrmModule } from './database/orm.module';
import { ConfigModule } from '@nestjs/config';
import config from './database/config/config';
import { RestaurantModule } from './modules/restaurant/restaurant.api.module';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './modules/user/persistance/User.entity';
import { PostModule } from './modules/post/post.module';
import { AuthGuardModule } from './module/AuthGuard/AuthGuard.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { PostMediaModule } from './modules/post-media/post-media.module';
import { LiveStreamModule } from './modules/livestream/livestream.module';

@Module({
  imports: [
    OrmModule,
    MikroOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule, RestaurantModule, PostModule,
    PostCommentModule, PostMediaModule, AuthGuardModule,
    LiveStreamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
