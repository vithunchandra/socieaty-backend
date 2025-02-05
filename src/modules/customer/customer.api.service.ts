import { BadRequestException, Injectable } from "@nestjs/common";
import { CustomerDaoService } from "./persistence/Customer.dao.service";
import { UserDaoService } from "../user/persistance/User.dao.service";
import { CustomerCreateDto } from "../auth/dto/CustomerCreate.dto";
import { UserMapper } from "../user/domain/user.mapper";

@Injectable()
export class CustomerService{
    constructor(
        private readonly customerDao: CustomerDaoService,
        private readonly userDao: UserDaoService,
    ){}

    async createCustomer(data: CustomerCreateDto){
        const user = this.userDao.create({
            name: data.name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data.role
        })
        const customer = this.customerDao.create(user, {});
        return customer;
    }

    async getProfile(user_id: string){
        const user = await this.customerDao.getProfile(user_id)
        if(!user){
            return new BadRequestException("User tidak ditemukan")
        }
        const userMapped = UserMapper.fromCustomerToDomain(user)
        userMapped.password = undefined
        return userMapped
    }
}