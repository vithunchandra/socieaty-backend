import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ReservationEntity } from './reservation.entity'
import { ReservationDaoService } from './reservation.dao.service'

@Module({
	imports: [MikroOrmModule.forFeature({ entities: [ReservationEntity] })],
	providers: [ReservationDaoService],
	exports: [ReservationDaoService]
})
export class ReservationDaoModule {}
