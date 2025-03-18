import { Module } from '@nestjs/common'
import { FoodOrderTransactionDaoService } from './food-order-transaction.dao.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MenuItemEntity } from '../../menu-items/persistence/menu-item.entity'
import { FoodOrderEntity } from './entity/food-order-transaction.entity'

@Module({
	imports: [MikroOrmModule.forFeature({ entities: [FoodOrderEntity, MenuItemEntity] })],
	providers: [FoodOrderTransactionDaoService],
	exports: [FoodOrderTransactionDaoService]
})
export class FoodOrderTransactionDaoModule {}
