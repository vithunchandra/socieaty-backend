import {
	Body,
	Controller,
	Get,
	ParseFilePipeBuilder,
	Put,
	Request,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { CustomerService } from './customer.api.service'
import { Roles } from 'src/module/RoleGuard/roles.decorator'
import { UserRole } from '../user/persistance/user.entity'
import { RolesGuard } from 'src/module/RoleGuard/roles.guard'
import { AuthGuard } from 'src/module/AuthGuard/auth-guard.service'
import { UpdateCustomerProfileRequestDto } from './dto/update-customer-profile-request.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import constants from '../../constants'
import { fileNameEditor, imageFileFilter } from '../../utils/image.utils'

@Controller('customer')
export class CustomerController {
	constructor(private customerService: CustomerService) {}

	@Get('profile')
	@Roles(UserRole.CUSTOMER)
	@UseGuards(AuthGuard, RolesGuard)
	async getProfile(@Request() req) {
		return await this.customerService.getProfile(req.user.id)
	}

	@Put('profile')
	@UseInterceptors(
		FileInterceptor('profilePicture', {
			storage: diskStorage({
				destination: constants().PROFILE_PICTURE_UPLOADS_DIR,
				filename: fileNameEditor
			}),
			fileFilter: imageFileFilter,
			limits: {
				fieldSize: 1000 * 1000 * 10
			}
		})
	)
	@Roles(UserRole.CUSTOMER)
	@UseGuards(AuthGuard, RolesGuard)
	async updateProfile(
		@Request() req,
		@Body() updateCustomerDto: UpdateCustomerProfileRequestDto,
		@UploadedFile(
			new ParseFilePipeBuilder().build({
				fileIsRequired: false
			})
		)
		profilePicture?: Express.Multer.File
	) {
		return await this.customerService.updateProfile(
			req.user.id,
			updateCustomerDto,
			profilePicture
		)
	}
}
