import { Module } from '@nestjs/common'
import { RestaurantMenuDaoModule } from './persistence/restaurant-menu.dao.module'
import { RestaurantMenuController } from './restaurant-menu.controller'
import { RestaurantMenuService } from './restaurant-menu.service'
import { UserDaoModule } from '../user/persistance/User.dao.module'

@Module({
	imports: [RestaurantMenuDaoModule, UserDaoModule],
	controllers: [RestaurantMenuController],
	providers: [RestaurantMenuService]
})
export class RestaurantMenuModule {}
