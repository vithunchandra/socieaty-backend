import { Module } from '@nestjs/common'
import { TopupDaoModule } from './persistence/topup.dao.module'
import { TopupController } from './topup.controller'
import { TopupService } from './topup.service'
import { MidtransModule } from '../midtrans/midtrans.module'

@Module({
	imports: [TopupDaoModule, MidtransModule],
	controllers: [TopupController],
	providers: [TopupService]
})
export class TopupModule {}
