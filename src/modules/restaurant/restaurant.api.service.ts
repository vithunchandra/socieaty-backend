import { Injectable } from "@nestjs/common";
import { RestaurantDaoService } from "src/modules/restaurant/persistence/Restaurant.dao.service";
import { UserDaoService } from "../user/persistance/User.dao.service";
import { RestaurantCreateDto } from "../auth/dto/RestaurantCreate.dto";
import { BASE_URL } from "src/constants";

@Injectable()
export class RestaurantService{
    constructor(
        private readonly restaurantDao: RestaurantDaoService,
        private readonly userDao: UserDaoService,
    ){}

    async createRestaurant(data: RestaurantCreateDto, image: Express.Multer.File){
        const user = this.userDao.create(data)
        const restaurant = this.restaurantDao.create(user, {
            userId: user.id,
            restaurantName: data.restaurantName,
            restaurantAddress: data.address,
            restaurantPhotoUrl: `${BASE_URL}/files/${image.filename}`
        })
        return restaurant;
    }

    async getProfile(user_id: string){
        return await this.restaurantDao.getProfile(user_id)
    }
}