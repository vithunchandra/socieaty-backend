import { Controller, Get, Logger, Param, Query, Request, UseGuards } from "@nestjs/common";
import { UserRole } from "src/modules/user/persistance/User.entity";
import { Roles } from "src/module/RoleGuard/roles.decorator";
import { RolesGuard } from "src/module/RoleGuard/roles.guard";
import { RestaurantService } from "./restaurant.api.service";
import { AuthGuard } from "src/module/AuthGuard/AuthGuard.service";
import { PaginateRestaurantRequestDto } from "./dto/paginate_restaurant_request.dto";

@Controller('restaurant')
export class RestaurantController{
    constructor(private restaurantService: RestaurantService){}
    @Get('profile')
    @Roles(UserRole.RESTAURANT)
    @UseGuards(AuthGuard, RolesGuard)
    async getProfile(@Request() req){
        return {
            data: await this.restaurantService.getProfile(req.user.id)
        }
    }

    @Get('themes')
    async getAllRestaurantThemes(){
        return await this.restaurantService.getAllRestaurantThemes()
    }

    @Get('')
    async paginateRestaurant(@Query() query: PaginateRestaurantRequestDto){
        return await this.restaurantService.paginateRestaurant(query)
    }

    @Get(':restaurantId')
    async getRestaurantById(@Param('restaurantId') restaurantId: string){
        return {
            data: await this.restaurantService.getRestaurantById(restaurantId)
        }
    }
}

