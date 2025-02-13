import { Module } from '@nestjs/common'
import { MenuCategoryEntity } from './menu-category.entity'
import { FoodMenuEntity } from './food-menu.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { FoodMenuDaoService } from './food-menu.dao.service'

@Module({
	imports: [MikroOrmModule.forFeature([FoodMenuEntity, MenuCategoryEntity])],
	providers: [FoodMenuDaoService],
	exports: [FoodMenuDaoService]
})
export class FoodMenuDaoModule {}
