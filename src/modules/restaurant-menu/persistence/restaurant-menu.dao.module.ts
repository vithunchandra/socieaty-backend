import { Module } from '@nestjs/common'
import { MenuCategoryEntity } from './menu-category.entity'
import { RestaurantMenuEntity } from './restaurant-menu.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { RestaurantMenuDaoService } from './restaurant-menu.dao.service'

@Module({
	imports: [
		MikroOrmModule.forFeature([RestaurantMenuEntity, MenuCategoryEntity])
	],
	providers: [RestaurantMenuDaoService],
	exports: [RestaurantMenuDaoService]
})
export class RestaurantMenuDaoModule {}
