import { EntityRepository, wrap } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UserEntity } from "../../../../modules/user/persistance/User.entity";
import { RestaurantEntity } from "src/modules/restaurant/persistence/Restaurant.entity";
import { CreateRestaurantDto } from "src/modules/restaurant/persistence/dto/RestaurantCreate.dto";

@Injectable()
export class RestaurantDaoService{
    constructor(
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: EntityRepository<RestaurantEntity>
    ){}

    create(user: UserEntity, data: CreateRestaurantDto): RestaurantEntity{
        const restaurant = new RestaurantEntity(
            user, data.restaurantName,
            data.restaurantPhotoUrl, data.restaurantAddress
        )
        this.restaurantRepository.getEntityManager().persist(restaurant)
        return restaurant
    }

    async getProfile(user_id: string): Promise<RestaurantEntity>{
        const restaurant = await this.restaurantRepository.findOne({
            userData: {id: user_id}
        }, {populate: ['userData']})
        return restaurant
    }
}