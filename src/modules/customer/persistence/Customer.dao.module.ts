import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CustomerEntity } from './customer.entity'
import { CustomerDaoService } from './customer.dao.service'

@Module({
	imports: [MikroOrmModule.forFeature([CustomerEntity])],
	controllers: [],
	providers: [CustomerDaoService],
	exports: [CustomerDaoService]
})
export class CustomerDaoModule {}
