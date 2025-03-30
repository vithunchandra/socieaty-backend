import { Module } from '@nestjs/common'
import { ReservationController } from './reservation.controller'
import { ReservationService } from './reservation.service'
import { ReservationDaoModule } from './persistence/reservation.dao.module'
import { TransactionDaoModule } from '../transaction/persistence/transaction.dao.module'
import { RestaurantDaoModule } from '../restaurant/persistence/Restaurant.dao.module'
import { FoodMenuDaoModule } from '../food-menu/persistence/food-menu.dao.module'
import { UserDaoModule } from '../user/persistance/User.dao.module'
import { MenuItemDaoModule } from '../menu-items/persistence/menu-item.dao.module'
import { ReservationGateway } from './reservation.gateway'
import { QRCodeModule } from '../qr-code/qr-code.module'
import { TransactionModule } from '../transaction/transaction.module'
import { SchedulerModule } from '../scheduler/scheduler.module'

@Module({
	imports: [
		ReservationDaoModule,
		TransactionModule,
		RestaurantDaoModule,
		FoodMenuDaoModule,
		UserDaoModule,
		MenuItemDaoModule,
		QRCodeModule,
		SchedulerModule
	],
	controllers: [ReservationController],
	providers: [ReservationService, ReservationGateway],
	exports: [ReservationService]
})
export class ReservationModule {}
