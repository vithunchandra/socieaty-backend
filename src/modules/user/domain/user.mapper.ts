import { wrap } from "@mikro-orm/core";
import { UserEntity } from "../persistance/User.entity";
import { User } from "./User";
import { CustomerMapper } from "src/modules/customer/domain/customer.mapper";
import { RestaurantMapper } from "src/modules/restaurant/domain/restaurant.mapper";
import { CustomerEntity } from "src/modules/customer/persistence/Customer.entity";
import { RestaurantEntity } from "src/modules/restaurant/persistence/Restaurant.entity";

export class UserMapper{
    static toDomain(raw: UserEntity){
        const user = new User()
        user.id = raw.id
        user.name = raw.name
        user.email = raw.email
        user.password = raw.password
        user.phoneNumber = raw.phoneNumber
        user.profilePictureUrl = raw.profilePictureUrl ?? null
        user.role = raw.role
        user.customerData = CustomerMapper.toDomain(raw.customerData);
        user.restaurantData = RestaurantMapper.toDomain(raw.restaurantData);
        return user
    }

    static fromCustomerToDomain(raw: CustomerEntity){
        const user = new User();
        const userData = raw.userData;
        user.id = userData.id
        user.email = userData.email
        user.name = userData.name
        user.password = userData.password
        user.phoneNumber = userData.phoneNumber
        user.role = userData.role
        user.customerData = CustomerMapper.toDomain(raw)
        user.restaurantData = null

        return user
    }

    static fromRestaurantToDomain(raw: RestaurantEntity){
        const user = new User();
        const userData = raw.userData;
        user.id = userData.id
        user.email = userData.email
        user.name = userData.name
        user.password = userData.password
        user.phoneNumber = userData.phoneNumber
        user.role = userData.role
        user.customerData = null
        user.restaurantData = RestaurantMapper.toDomain(raw)

        return user
    }
}