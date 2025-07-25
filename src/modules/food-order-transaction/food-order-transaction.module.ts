import { Module } from '@nestjs/common'
import { FoodOrderTransactionDaoModule } from './persistence/food-order-transaction.dao.module'
import { RestaurantDaoModule } from '../restaurant/persistence/restaurant.dao.module'
import { FoodMenuDaoModule } from '../food-menu/persistence/food-menu.dao.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'
import { FoodOrderTransactionController } from './food-order-transaction.controller'
import { FoodOrderTransactionService } from './food-order-transaction.service'
import { FoodOrderTransactionGateway } from './food-order-transaction.gateway'
import { MenuItemDaoModule } from '../menu-items/persistence/menu-item.dao.module'
import { TransactionModule } from '../transaction/transaction.module'
import { SchedulerModule } from '../scheduler/scheduler.module'
import { QRCodeModule } from '../qr-code/qr-code.module'

@Module({
	imports: [
		FoodOrderTransactionDaoModule,
		TransactionModule,
		RestaurantDaoModule,
		FoodMenuDaoModule,
		UserDaoModule,
		MenuItemDaoModule,
		SchedulerModule,
		QRCodeModule
	],
	controllers: [FoodOrderTransactionController],
	providers: [FoodOrderTransactionService, FoodOrderTransactionGateway],
	exports: [FoodOrderTransactionService]
})
export class FoodOrderTransactionModule {}
