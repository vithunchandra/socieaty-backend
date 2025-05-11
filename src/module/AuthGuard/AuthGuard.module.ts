import { Module } from '@nestjs/common'
import { AuthGuard } from './AuthGuard.service'
import { UserDaoModule } from 'src/modules/user/persistance/user.dao.module'

@Module({
	imports: [UserDaoModule],
	providers: [AuthGuard],
	exports: [AuthGuard]
})
export class AuthGuardModule {}
