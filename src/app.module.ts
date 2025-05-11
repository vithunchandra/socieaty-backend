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
import { UserEntity } from './modules/user/persistance/user.entity'
import { PostModule } from './modules/post/post.module'
import { AuthGuardModule } from './module/AuthGuard/auth-guard.module'
import { PostCommentModule } from './modules/post-comment/post-comment.module'
import { LiveStreamModule } from './modules/livestream/livestream.module'
import { FoodMenuModule } from './modules/food-menu/food-menu.module'
import { MediaModule } from './modules/media/media.module'
import { TransactionModule } from './modules/transaction/transaction.module'
import { TransactionMessageModule } from './modules/transaction-message/transaction-message.module'
import { FoodOrderTransactionModule } from './modules/food-order-transaction/food-order-transaction.module'
import { TransactionReviewModule } from './modules/transaction-review/transaction-review.module'
import { ReservationModule } from './modules/reservation/reservation.module'
import { ScheduleModule } from '@nestjs/schedule'
import { PaymentModule } from './modules/payment/payment.module'
import { TopupModule } from './modules/topup/topup.module'
import { UserModule } from './modules/user/user.module'
import { SupportTicketModule } from './modules/support-ticket/support-ticket.module'

@Module({
	imports: [
		OrmModule,
		MikroOrmModule.forFeature([UserEntity]),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		JwtModule.register({
			global: true,
			secret: process.env.AUTH_SECRET_KEY,
			signOptions: { expiresIn: '1d' }
		}),
		AuthModule,
		UserModule,
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
		TransactionReviewModule,
		ReservationModule,
		TopupModule,
		PaymentModule,
		SupportTicketModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
