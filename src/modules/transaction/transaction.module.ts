import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionDaoModule } from './persistence/transaction.dao.module'
import { TransactionController } from './transaction.controller'
import { RestaurantDaoModule } from '../restaurant/persistence/Restaurant.dao.module'
import { CustomerDaoModule } from '../customer/persistence/Customer.dao.module'
import { FoodMenuDaoModule } from '../food-menu/persistence/food-menu.dao.module'
import { UserDaoModule } from '../user/persistance/User.dao.module'
import { TransactionGateway } from './transaction.gateway'
import { JwtService } from '@nestjs/jwt'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TransactionEntity } from './persistence/entity/transaction.entity'
import { TransactionMenuItemEntity } from './persistence/entity/transaction-menu-item.entity'

@Module({
	imports: [TransactionDaoModule, RestaurantDaoModule, FoodMenuDaoModule, UserDaoModule],
	controllers: [TransactionController],
	providers: [TransactionService, TransactionGateway, JwtService],
	exports: [TransactionService]
})
export class TransactionModule {}
