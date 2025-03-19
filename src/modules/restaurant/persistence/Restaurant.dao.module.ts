import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { RestaurantEntity } from './entity/Restaurant.entity'
import { RestaurantDaoService } from './Restaurant.dao.service'
import { RestaurantThemeEntity } from './entity/restaurant-theme.entity'
import { ReservationConfigEntity } from './entity/reservation-config.entity'
import { ReservationFacilityEntity } from './entity/reservation-facility.entity'

@Module({
	imports: [
		MikroOrmModule.forFeature([
			RestaurantEntity,
			RestaurantThemeEntity,
			ReservationConfigEntity,
			ReservationFacilityEntity
		])
	],
	controllers: [],
	providers: [RestaurantDaoService],
	exports: [RestaurantDaoService]
})
export class RestaurantDaoModule {}
