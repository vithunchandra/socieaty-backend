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

@Module({
	imports: [
		ReservationDaoModule,
		TransactionDaoModule,
		RestaurantDaoModule,
		FoodMenuDaoModule,
		UserDaoModule,
		MenuItemDaoModule
	],
	controllers: [ReservationController],
	providers: [ReservationService, ReservationGateway],
	exports: [ReservationService]
})
export class ReservationModule {}
