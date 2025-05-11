import { Module } from '@nestjs/common'
import { RestaurantDaoModule } from 'src/modules/restaurant/persistence/restaurant.dao.module'
import { RestaurantController } from './restaurant.api.controller'
import { RestaurantService } from './restaurant.api.service'
import { UserDaoModule } from '../user/persistance/user.dao.module'

@Module({
	imports: [RestaurantDaoModule, UserDaoModule],
	providers: [RestaurantService],
	controllers: [RestaurantController],
	exports: [RestaurantService]
})
export class RestaurantModule {}
