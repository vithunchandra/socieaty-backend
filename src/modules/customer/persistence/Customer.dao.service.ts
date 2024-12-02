import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Customer } from "./Customer.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CustomerCreateDto } from "./dto/CustomerCreate.dto";
import { UserEntity } from "../../user/persistance/User.entity";

@Injectable()
export class CustomerDaoService{
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: EntityRepository<Customer>
    ){}

    create(user: UserEntity, data: CustomerCreateDto): Customer{
        const customer = new Customer(user, data.name)
        this.customerRepository.getEntityManager().persist(customer)
        return customer
    }

    async getProfile(user_id: string): Promise<Customer>{
        const customer = await this.customerRepository.findOne({
            userData: {id: user_id}
        }, {populate: ['userData']});
        return customer
    }
}