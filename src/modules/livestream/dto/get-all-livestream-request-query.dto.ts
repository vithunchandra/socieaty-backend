import { IsOptional, IsString } from 'class-validator'
import { UserRole } from '../../user/persistance/user.entity'
import { Transform } from 'class-transformer'
import { fieldToUserRole } from '../../../utils/request_field_transformer.util'

export class GetAllLivestreamsRequestQueryDto {
	@IsString()
	@IsOptional()
	searchQuery?: string

	@IsOptional()
	@Transform((value) => fieldToUserRole(value))
	role?: UserRole
}
