import { Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { PaginateUsersRequestQueryDto } from './dto/paginate-users-request-query.dto'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from './persistance/user.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('')
	@UseGuards(AuthGuard)
	async paginateUsers(
		@Query() query: PaginateUsersRequestQueryDto,
		@Req() req: GuardedRequestDto
	) {
		return await this.userService.paginateUsers(query, req.user)
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async deleteUser(@Param('id') id: string, @Req() req: GuardedRequestDto) {
		return await this.userService.deleteUser(id)
	}

	@Put(':id/undelete')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async undeleteUser(@Param('id') id: string) {
		return await this.userService.undeleteUser(id)
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	async getUserById(@Param('id') id: string, @Req() req: GuardedRequestDto) {
		return this.userService.getUserData(id, req.user)
	}
}
