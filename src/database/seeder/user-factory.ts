import { Factory } from "@mikro-orm/seeder";
import { UserEntity, UserRole } from "../../modules/user/persistance/User.entity";
import { faker } from '@faker-js/faker';

export class UserFactory extends Factory<UserEntity> {
    model = UserEntity;
    protected definition(): Partial<UserEntity> {
        let role = UserRole.CUSTOMER
        if(faker.number.binary() === '1'){
            role = UserRole.RESTAURANT
        }
        return {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            password: faker.internet.password(),
            role: role,
        }
    }
}