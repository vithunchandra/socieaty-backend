import { Module } from '@nestjs/common'
import { UserDaoModule } from './persistance/user.dao.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [UserDaoModule],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
