import { RestaurantMenuService } from './restaurant-menu.service'
import { CreateRestaurantMenuRequestDto } from './dto/create-restaurant-menu-request.dto'
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
	Delete
} from '@nestjs/common'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateRestaurantMenuRequestDto } from './dto/update-restaurant-menu-request.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { RESTAURANT_MENU_UPLOADS_DIR } from '../../constants'
import { fileNameEditor, imageFileFilter } from '../../utils/image.utils'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { UpdateMenuStockRequestDto } from './dto/update-menu-stock-request.dto'

@Controller('restaurant/menu')
export class RestaurantMenuController {
	constructor(private readonly restaurantMenuService: RestaurantMenuService) {}

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
		@Body() data: CreateRestaurantMenuRequestDto,
		@UploadedFile() menuPicture: Express.Multer.File
	) {
		return await this.restaurantMenuService.createMenu(
			req.user.restaurantData,
			menuPicture,
			data
		)
	}

	@Get(':restaurantid')
	async findAllMenuByRestaurantId(
		@Request() req: GuardedRequestDto,
		@Param('restaurantid') restaurantId: string
	) {
		return await this.restaurantMenuService.findAllMenusByRestaurantId(restaurantId)
	}

	@Put(':menuId/stock')
	@UseGuards(AuthGuard)
	async updateMenuStockAvailablity(
		@Request() req: GuardedRequestDto,
		@Param('menuId') menuId: string,
		@Body() data: UpdateMenuStockRequestDto
	) {
		return await this.restaurantMenuService.updateMenuStockAvailablity(
			req.user.restaurantData,
			menuId,
			data.isAvailable
		)
	}

	@Delete(':menuId')
	@UseGuards(AuthGuard)
	async removeMenu(@Request() req: GuardedRequestDto, @Param('menuId') menuId: string) {
		return await this.restaurantMenuService.removeMenu(req.user.restaurantData, menuId)
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
		@Body() data: UpdateRestaurantMenuRequestDto,
		@Param('menuId') menuId: string,
		@UploadedFile(
			new ParseFilePipeBuilder().build({
				fileIsRequired: false
			})
		)
		menuPicture?: Express.Multer.File
	) {
		return await this.restaurantMenuService.updateMenu(
			req.user.restaurantData,
			menuId,
			data,
			menuPicture
		)
	}

	@Get('categories')
	async getAllMenuCategories() {
		return await this.restaurantMenuService.getAllMenuCategories()
	}

	// @Get('')
	// @UseGuards(AuthGuard)

	// async findAllMenu(@Request() req: GuardedRequestDto) {
	// 	console.log(req.user)
	// 	if (!req.user.restaurantData) {
	// 		throw new BadRequestException('Unauthorized Request')
	// 	}
	// 	return await this.restaurantMenuService.findAllMenusByRestaurantId(req.user.restaurantData!.id)
	// }
}
