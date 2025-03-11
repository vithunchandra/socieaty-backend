import { Global, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.api.module'
import { OrmModule } from './database/orm.module'
import { ConfigModule } from '@nestjs/config'
import config from './database/config/config'
import { RestaurantModule } from './modules/restaurant/restaurant.api.module'
import { JwtModule } from '@nestjs/jwt'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { UserEntity } from './modules/user/persistance/User.entity'
import { PostModule } from './modules/post/post.module'
import { AuthGuardModule } from './module/AuthGuard/AuthGuard.module'
import { PostCommentModule } from './modules/post-comment/post-comment.module'
import { LiveStreamModule } from './modules/livestream/livestream.module'
import { FoodMenuModule } from './modules/food-menu/food-menu.module'
import { MediaModule } from './modules/media/media.module'
import { TransactionModule } from './modules/transaction/transaction.module'
import { TransactionMessageModule } from './modules/transaction-message/transaction-message.module'
import { FoodOrderTransactionModule } from './modules/food-order-transaction/food-order-transaction.module'
import { TransactionReviewModule } from './modules/transaction-review/transaction-review.module'

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
			signOptions: { expiresIn: '1d' }
		}),
		AuthModule,
		RestaurantModule,
		PostModule,
		PostCommentModule,
		MediaModule,
		AuthGuardModule,
		LiveStreamModule,
		FoodMenuModule,
		TransactionModule,
		TransactionMessageModule,
		FoodOrderTransactionModule,
		TransactionReviewModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
