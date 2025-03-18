import { Module } from '@nestjs/common'
import { TransactionDaoService } from './transaction.dao.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TransactionEntity } from './transaction.entity'
import { MenuItemEntity } from '../../menu-items/persistence/menu-item.entity'

@Module({
	imports: [MikroOrmModule.forFeature([TransactionEntity, MenuItemEntity])],
	providers: [TransactionDaoService],
	exports: [TransactionDaoService]
})
export class TransactionDaoModule {}
