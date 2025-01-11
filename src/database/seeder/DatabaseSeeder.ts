import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../modules/user/domain/User';
import { UserEntity, UserRole } from '../../modules/user/persistance/User.entity';
import { v7 } from 'uuid';
import { faker } from '@faker-js/faker';
import { RestaurantFactory } from './restaurant-factory';
import { UserFactory } from './user-factory';
import { CustomerFactory } from './customer-factory';
import { RestaurantEntity } from '../../modules/restaurant/persistence/Restaurant.entity';
import { Point } from '../../modules/restaurant/persistence/custom-type/PointType';
import { CustomerEntity } from '../../modules/customer/persistence/Customer.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: UserEntity[] = []
    const restaurants: RestaurantEntity[] = []
    const customers: CustomerEntity[] = []
    for(let i = 0; i < 20; i++) {
      let role = UserRole.CUSTOMER
      if(faker.number.binary() === '1'){
          role = UserRole.RESTAURANT
      }
      const user = em.create(UserEntity, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        password: faker.internet.password(),
        role: role,
      })
      if(role === UserRole.RESTAURANT){
        const restaurant = em.create(RestaurantEntity, {
          location: new Point(faker.location.latitude(), faker.location.longitude()),
          photoUrl: "",
          userData: user
        })
        restaurants.push(restaurant)
      }else{
        const customer = em.create(CustomerEntity, {
          bio: "",
          photoProfileUrl: "",
          wallet: 0,
          userData: user
        })
        customers.push(customer)
      }
      users.push(user)
    }
  }
}

