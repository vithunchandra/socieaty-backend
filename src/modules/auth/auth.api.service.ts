import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDaoService } from "src/modules/user/persistance/User.dao.service";
import { UserSigninDto } from "./dto/UserSignin.dto";
import { JwtService } from "@nestjs/jwt";
import { CustomerCreateDto } from "./dto/CustomerCreate.dto";
import { Customer } from "src/modules/customer/persistence/Customer.entity";
import { RestaurantCreateDto } from "./dto/RestaurantCreate.dto";
import { EntityManager } from "@mikro-orm/postgresql";
import { RestaurantService } from "../restaurant/restaurant.api.service";
import { RestaurantMapper } from "../restaurant/domain/restaurant.mapper";
import { CustomerDaoService } from "../customer/persistence/Customer.dao.service";
import { RestaurantSignupResponseDto } from "./dto/restaurant-signup-response.dto";

@Injectable()
export class AuthService{
    constructor(
        private readonly restaurantService: RestaurantService,
        private readonly userDao: UserDaoService,
        private readonly customerDao: CustomerDaoService,
        private readonly em: EntityManager,
        private readonly jwtService: JwtService
    ){}
    async customerSignup(data: CustomerCreateDto): Promise<Customer>{
        if(data.password !== data.confirmPassword){
            throw new BadRequestException("Password and confirm password is not matched")
        }

        const isExist = await this.userDao.findOneByEmail(data.email)
        if(isExist){
            throw new BadRequestException("Email is already been taken")
        }

        const user = this.userDao.create(data)
        const customer = this.customerDao.create(user, {
            name: data.name
        })
        await this.em.flush()

        return customer
    }

    async restaurantSignup(data: RestaurantCreateDto, image: Express.Multer.File): Promise<RestaurantSignupResponseDto>{
        if(data.password !== data.confirmPassword){
            throw new BadRequestException("Password and confirm password is not matched")
        }

        const isExist = await this.userDao.findOneByEmail(data.email)
        if(isExist){
            throw new BadRequestException("Email is already been taken")
        }
        
        const restaurant = await this.restaurantService.createRestaurant(data, image)
        const restaurantMapped = RestaurantMapper.toDomain(restaurant)
        return {
            token: await this.jwtService.signAsync({...restaurantMapped}),
            restaurant: restaurantMapped
        };
    }

    async signin(data: UserSigninDto): Promise<string>{
        const user = await this.userDao.findOneByEmail(data.email)
        if(!user){
            throw new BadRequestException("User not found")
        }
        if(user.password != data.password){
            throw new BadRequestException("Wrong password")
        }

        const payload = {
            ...user,
            password: undefined,
        }
        return await this.jwtService.signAsync(payload)
    }
}