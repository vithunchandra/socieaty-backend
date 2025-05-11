import { Module } from '@nestjs/common'
import { CustomerDaoModule } from './persistence/customer.dao.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'
import { JwtModule } from '@nestjs/jwt'
import { CustomerService } from './customer.api.service'
import { CustomerController } from './customer.api.controller'

@Module({
	imports: [CustomerDaoModule, UserDaoModule],
	providers: [CustomerService],
	controllers: [CustomerController],
	exports: [CustomerService]
})
export class CustomerModule {}
