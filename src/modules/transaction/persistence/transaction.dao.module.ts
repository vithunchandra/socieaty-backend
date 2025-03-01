import { Module } from '@nestjs/common'
import { TransactionDaoService } from './transaction.dao.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TransactionEntity } from './entity/transaction.entity'
import { TransactionMenuItemEntity } from './entity/transaction-menu-item.entity'

@Module({
	imports: [MikroOrmModule.forFeature([TransactionEntity, TransactionMenuItemEntity])],
	providers: [TransactionDaoService],
	exports: [TransactionDaoService]
})
export class TransactionDaoModule {}
