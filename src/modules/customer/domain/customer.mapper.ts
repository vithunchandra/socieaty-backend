import { CustomerEntity } from "../persistence/Customer.entity";
import { Customer } from "./customer";

export class CustomerMapper{
    static toDomain(raw: CustomerEntity | null): Customer | null {   
        if(!raw) return null;
        
        const customer = new Customer()
        customer.photoProfileUrl = raw.photoProfileUrl
        customer.wallet = raw.wallet;
        customer.bio = raw.bio;

        return customer
    }
}