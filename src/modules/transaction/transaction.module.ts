import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionDaoModule } from './persistence/transaction.dao.module'
import { TransactionController } from './transaction.controller'
import { RestaurantDaoModule } from '../restaurant/persistence/restaurant.dao.module'
import { CustomerDaoModule } from '../customer/persistence/customer.dao.module'
import { FoodMenuDaoModule } from '../food-menu/persistence/food-menu.dao.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'
import { FoodOrderTransactionGateway } from '../food-order-transaction/food-order-transaction.gateway'
import { JwtService } from '@nestjs/jwt'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TransactionEntity } from './persistence/transaction.entity'
import { MenuItemEntity } from '../menu-items/persistence/menu-item.entity'

@Module({
	imports: [TransactionDaoModule, RestaurantDaoModule, FoodMenuDaoModule, UserDaoModule],
	controllers: [TransactionController],
	providers: [TransactionService, FoodOrderTransactionGateway, JwtService],
	exports: [TransactionService]
})
export class TransactionModule {}
