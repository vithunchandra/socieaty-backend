import { wrap } from "@mikro-orm/core";
import { UserEntity } from "../persistance/User.entity";
import { User } from "./User";

export class UserMapper{
    toDomain(raw: UserEntity){
        const user = new User()
        user.id = raw.id
        user.email = raw.email
        user.password = raw.password
        user.phoneNumber = raw.phoneNumber
        user.role = raw.role
        
        return user
    }
}