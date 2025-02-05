import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserEntity, UserRole } from '../../modules/user/persistance/User.entity';
import { faker } from '@faker-js/faker';
import { RestaurantEntity } from '../../modules/restaurant/persistence/Restaurant.entity';
import { Point } from '../../modules/restaurant/persistence/custom-type/PointType';
import { CustomerEntity } from '../../modules/customer/persistence/Customer.entity';
import { BankEnum } from '../../enums/bank.enum';
import { RestaurantThemeEntity } from '../../modules/restaurant/persistence/restaurant-theme.entity';
import { PROFILE_PICTURE_UPLOADS_DIR, RESTAURANT_BANNER_UPLOADS_DIR } from '../../constants';

const bank: BankEnum[] = [BankEnum.BNI, BankEnum.BCA, BankEnum.BRI, BankEnum.MANDIRI]
const themeName: string[] = [
  'Casual',
  'Fine Dining',
  'Cafe',
  'Bistro',
  'Street Food',
  'Fusion',
  'Ethnic',
  'Modern',
  'Asian Food',
  'Fast Food',
  'Buffet',
]

const dummyProfilePicture: string[] = ["man_1.jpg", "man_2.jpg", "girl_1.jpg", "girl_2.jpg"]
const dummyRestaurantBanner: string[] = ["restaurant_1.jpg", "restaurant_2.jpg", "restaurant_3.jpg"]


export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: UserEntity[] = []
    const restaurants: RestaurantEntity[] = []
    const customers: CustomerEntity[] = []
    const restaurantThemes: RestaurantThemeEntity[] = []

    for(const theme of themeName){
      console.log(theme)
      restaurantThemes.push(em.create(RestaurantThemeEntity, {name: theme}))
    }

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
        profilePictureUrl: `${PROFILE_PICTURE_UPLOADS_DIR}/${faker.helpers.arrayElement(dummyProfilePicture)}`,
        role: role,
      })
      if(role === UserRole.RESTAURANT){
        const restaurant = em.create(RestaurantEntity, {
          location: new Point(faker.location.latitude(), faker.location.longitude()),
          userData: user,
          restaurantBannerUrl: `${RESTAURANT_BANNER_UPLOADS_DIR}/${faker.helpers.arrayElement(dummyRestaurantBanner)}`,
          payoutBank: faker.helpers.arrayElement(bank) as BankEnum,
          accountNumber: faker.number.int({min: 10000000, max: 99999999}).toString(),
          themes: faker.helpers.arrayElement(restaurantThemes).id
        })
        restaurants.push(restaurant)
      }else{
        const customer = em.create(CustomerEntity, {
          bio: "",
          wallet: 0,
          userData: user
        })
        customers.push(customer)
      }
      users.push(user)
    }
  }
}

