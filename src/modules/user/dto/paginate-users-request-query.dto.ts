import { Transform, Type } from "class-transformer"
import { PaginationQueryDto } from "../../../dto/pagination-query.dto"
import { IsOptional, IsString } from "class-validator"
import { UserRole } from "../persistance/User.entity"
import { fieldToUserRole } from "../../../utils/request_field_transformer.util"

export class PaginateUsersRequestQueryDto {
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	email?: string

	@IsOptional()
	@Transform((value) => fieldToUserRole(value))
	role?: UserRole
}
