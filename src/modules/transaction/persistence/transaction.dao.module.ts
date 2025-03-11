import { Module } from '@nestjs/common'
import { TransactionDaoService } from './transaction.dao.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TransactionEntity } from './transaction.entity'
import { FoodOrderMenuItemEntity } from '../../food-order-transaction/persistence/entity/food-order-menu-item.entity'

@Module({
	imports: [MikroOrmModule.forFeature([TransactionEntity, FoodOrderMenuItemEntity])],
	providers: [TransactionDaoService],
	exports: [TransactionDaoService]
})
export class TransactionDaoModule {}
