import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Request,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { UserSigninDto } from './dto/user-signin.dto'
import { RestaurantCreateDto } from './dto/restaurant-create-request.dto'
import { CustomerCreateDto } from './dto/customer-create-request.dto'
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import constants from 'src/constants'
import { fileNameEditor, imageFileFilter } from 'src/utils/image.utils'
import { AuthService } from './auth.api.service'
import { AuthGuard } from 'src/module/AuthGuard/auth-guard.service'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup/customer')
	async customerSignup(@Body() data: CustomerCreateDto) {
		return await this.authService.customerSignup(data)
	}

	@Post('signup/restaurant')
	// @UseInterceptors(
	// 	FileInterceptor('profilePicture', {
	// 		storage: diskStorage({
	// 			destination: PROFILE_PICTURE_UPLOADS_DIR,
	// 			filename: fileNameEditor
	// 		}),
	// 		fileFilter: imageFileFilter,
	// 		limits: {
	// 			fieldSize: 1000 * 1000 * 10
	// 		}
	// 	}),
	// 	FileInterceptor('restaurantBanner', {
	// 		storage: diskStorage({
	// 			destination: RESTAURANT_BANNER_UPLOADS_DIR,
	// 			filename: fileNameEditor
	// 		}),
	// 		fileFilter: imageFileFilter,
	// 		limits: {
	// 			fieldSize: 1000 * 1000 * 10
	// 		}
	// 	})
	// )
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'profilePicture', maxCount: 1 },
				{ name: 'restaurantBanner', maxCount: 1 }
			],
			{
				storage: diskStorage({
					destination: (req, file, cb) => {
						if (file.fieldname === 'profilePicture') {
							cb(null, constants().PROFILE_PICTURE_UPLOADS_DIR)
						} else {
							cb(null, constants().RESTAURANT_BANNER_UPLOADS_DIR)
						}
					},
					filename: fileNameEditor
				}),
				fileFilter: imageFileFilter,
				limits: {
					fieldSize: 1000 * 1000 * 10
				}
			}
		)
	)
	async restaurantSignup(
		@Body() data: RestaurantCreateDto,
		@UploadedFiles()
		files: {
			profilePicture?: Express.Multer.File[]
			restaurantBanner?: Express.Multer.File[]
		}
	) {
		return await this.authService.restaurantSignup(
			data,
			files.profilePicture![0],
			files.restaurantBanner![0]
		)
	}

	@Post('signin')
	async signin(@Body() data: UserSigninDto) {
		return await this.authService.signin(data)
	}

	@UseGuards(AuthGuard)
	@Get('session/data')
	async getData(@Request() req) {
		return this.authService.getData(req.user.id)
	}
}
