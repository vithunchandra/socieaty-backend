import { Module } from '@nestjs/common'
import { FoodMenuDaoModule } from './persistence/food-menu.dao.module'
import { FoodMenuController } from './food-menu.controller'
import { FoodMenuService } from './food-menu.service'
import { UserDaoModule } from '../user/persistance/User.dao.module'

@Module({
	imports: [FoodMenuDaoModule, UserDaoModule],
	controllers: [FoodMenuController],
	providers: [FoodMenuService]
})
export class FoodMenuModule {}
