import { FoodMenuService } from './food-menu.service'
import { CreateFoodMenuRequestDto } from './dto/create-food-menu-request.dto'
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Request,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	ParseFilePipeBuilder,
	Delete,
	Query
} from '@nestjs/common'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateFoodMenuRequestDto } from './dto/update-food-menu-request.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { RESTAURANT_MENU_UPLOADS_DIR } from '../../constants'
import { fileNameEditor, imageFileFilter } from '../../utils/image.utils'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { UpdateMenuStockRequestDto } from './dto/update-menu-stock-request.dto'
import { GetAllFoodMenuQueryDto } from './dto/get-all-food-menu-query.dto'
import { PaginateMenuRequestDto } from './dto/paginate-menu-request.dto'

@Controller('menu')
export class FoodMenuController {
	constructor(private readonly foodMenuService: FoodMenuService) {}

	@Post('')
	@UseInterceptors(
		FileInterceptor('menuPicture', {
			storage: diskStorage({
				destination: RESTAURANT_MENU_UPLOADS_DIR,
				filename: fileNameEditor
			}),
			fileFilter: imageFileFilter,
			limits: {
				fieldSize: 1000 * 1000 * 10
			}
		})
	)
	@UseGuards(AuthGuard)
	async createMenu(
		@Request() req: GuardedRequestDto,
		@Body() data: CreateFoodMenuRequestDto,
		@UploadedFile() menuPicture: Express.Multer.File
	) {
		return await this.foodMenuService.createMenu(
			req.user.restaurantData,
			menuPicture,
			data
		)
	}

	@Get('categories')
	async getAllMenuCategories() {
		return await this.foodMenuService.getAllMenuCategories()
	}

	@Get('categories/popular')
	async getMenuCategoriesOrderByPopularity() {
		return await this.foodMenuService.getMenuCategoriesOrderByPopularity()
	}

	@Get('')
	async paginateMenu(
		@Query() query: PaginateMenuRequestDto
	) {
		return await this.foodMenuService.paginateMenu(query)
	}

	@Get(':restaurantid')
	async findAllMenuByRestaurantId(
		@Param('restaurantid') restaurantId: string,
		@Query() query: GetAllFoodMenuQueryDto
	) {
		return await this.foodMenuService.findAllMenusByRestaurantId(restaurantId, query)
	}

	

	@Put(':menuId/stock')
	@UseGuards(AuthGuard)
	async updateMenuStockAvailablity(
		@Request() req: GuardedRequestDto,
		@Param('menuId') menuId: string,
		@Body() data: UpdateMenuStockRequestDto
	) {
		return await this.foodMenuService.updateMenuStockAvailablity(
			req.user.restaurantData,
			menuId,
			data.isAvailable
		)
	}

	@Get('single/:menuId')
	async findMenuById(@Param('menuId') menuId: string) {
		return await this.foodMenuService.findMenuById(menuId)
	}

	@Delete(':menuId')
	@UseGuards(AuthGuard)
	async removeMenu(@Request() req: GuardedRequestDto, @Param('menuId') menuId: string) {
		return await this.foodMenuService.removeMenu(req.user.restaurantData, menuId)
	}

	@Put(':menuId')
	@UseInterceptors(
		FileInterceptor('menuPicture', {
			storage: diskStorage({
				destination: RESTAURANT_MENU_UPLOADS_DIR,
				filename: fileNameEditor
			}),
			fileFilter: imageFileFilter,
			limits: {
				fieldSize: 1000 * 1000 * 10
			}
		})
	)
	@UseGuards(AuthGuard)
	async updateMenu(
		@Request() req: GuardedRequestDto,
		@Body() data: UpdateFoodMenuRequestDto,
		@Param('menuId') menuId: string,
		@UploadedFile(
			new ParseFilePipeBuilder().build({
				fileIsRequired: false
			})
		)
		menuPicture?: Express.Multer.File
	) {
		return await this.foodMenuService.updateMenu(
			req.user.restaurantData,
			menuId,
			data,
			menuPicture
		)
	}

	// @Get('')
	// @UseGuards(AuthGuard)

	// async findAllMenu(@Request() req: GuardedRequestDto) {
	// 	if (!req.user.restaurantData) {
	// 		throw new BadRequestException('Unauthorized Request')
	// 	}
	// 	return await this.foodMenuService.findAllMenusByRestaurantId(req.user.restaurantData!.id)
	// }
}
