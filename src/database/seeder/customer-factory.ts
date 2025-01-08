import { Factory } from "@mikro-orm/seeder";
import { CustomerEntity } from "../../modules/customer/persistence/Customer.entity";
import { Constructor, EntityData } from "@mikro-orm/core";

export class CustomerFactory extends Factory<CustomerEntity> {
    model: Constructor<CustomerEntity> = CustomerEntity;
    protected definition(): EntityData<CustomerEntity> {
        return {
            bio: "",
            photoProfileUrl: "",
            wallet: 0,
        }
    }

}