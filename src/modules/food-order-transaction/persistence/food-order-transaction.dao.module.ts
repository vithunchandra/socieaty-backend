import { Module } from '@nestjs/common'
import { FoodOrderTransactionDaoService } from './food-order-transaction.dao.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { FoodOrderMenuItemEntity } from './entity/food-order-menu-item.entity'
import { FoodOrderEntity } from './entity/food-order-transaction.entity'

@Module({
	imports: [MikroOrmModule.forFeature({ entities: [FoodOrderEntity, FoodOrderMenuItemEntity] })],
	providers: [FoodOrderTransactionDaoService],
	exports: [FoodOrderTransactionDaoService]
})
export class FoodOrderTransactionDaoModule {}
