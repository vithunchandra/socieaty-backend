import { Module } from '@nestjs/common'
import { TopupDaoModule } from './persistence/topup.dao.module'
import { TopupController } from './topup.controller'
import { TopupService } from './topup.service'
import { MidtransModule } from '../midtrans/midtrans.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'
import { TopupGateway } from './topup.gateway'

@Module({
	imports: [TopupDaoModule, MidtransModule, UserDaoModule],
	controllers: [TopupController],
	providers: [TopupService, TopupGateway]
})
export class TopupModule {}
