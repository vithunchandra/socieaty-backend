import { Entity, Enum, HiddenProps, OneToOne, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { BaseEntity } from '../../../database/model/base/Base.entity';
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity';
import { Customer } from '../../customer/persistence/Customer.entity';

@Entity({tableName: "user"})
export class UserEntity extends BaseEntity{

   @Property({nullable: false, unique: true, type:'varchar(128)'})
   email!: string

   @Property({nullable: false, type:'varchar(128)'})
   password!: string

   @Property({nullable: false})
   phoneNumber: string

   @Enum(() => UserRole)
   role: UserRole

   @OneToOne({
      entity: () => RestaurantEntity,
      mappedBy: (restaurant) => restaurant.userData,
      nullable: true,
      hidden: true
   })
   restaurantData: RestaurantEntity | null = null

   @OneToOne({
      entity: () => Customer,
      mappedBy: (customer) => customer.userData,
      nullable: true,
      hidden: true
   })
   customerData: Customer | null = null

   constructor(email: string, password: string, phoneNumber: string, role: UserRole){
      super();
      this.email = email
      this.password = password
      this.phoneNumber = phoneNumber
      this.role = role
   }
}

export enum UserRole{
   ADMIN = "Admin",
   CUSTOMER = "Customer",
   RESTAURANT = "Restaurant"
}