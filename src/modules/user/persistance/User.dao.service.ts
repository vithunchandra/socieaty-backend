import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./User.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UserCreateDto } from "./dto/UserDao.dto";

@Injectable()
export class UserDaoService{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>
    ){}

    create(data: UserCreateDto): UserEntity{
        const user = new UserEntity(
            data.email,
            data.password,
            data.phoneNumber,
            data.role
        )

        this.userRepository.getEntityManager().persist(user)
        return user
    }

    async findOneByEmail(email: string): Promise<UserEntity>{
        const user = await this.userRepository.findOne({
            email: email
        }, {populate: ['restaurantData', 'customerData']})

        return user;
    }
}