import { EntityManager } from '@mikro-orm/postgresql'
import { RestaurantThemeEntity } from '../../modules/restaurant/persistence/entity/restaurant-theme.entity'
import { MenuCategoryEntity } from '../../modules/food-menu/persistence/menu-category.entity'
import { PostHashtagEntity } from '../../modules/post-hashtag/persistence/post-hashtag.entity'
import { ReservationFacilityEntity } from '../../modules/restaurant/persistence/entity/reservation-facility.entity'
import { UserEntity, UserRole } from '../../modules/user/persistance/user.entity'
import constants from '../../constants'
import { faker } from '@faker-js/faker'
import { Seeder } from '@mikro-orm/seeder'
import dotenv from 'dotenv'

dotenv.config()

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
	'Buffet'
]
const reservationFacilitiesName: string[] = [
	'Outdoor',
	'Indoor',
	'VIP Room',
	'Private Room',
	'Wifi',
	'Parking',
	'Smoking Area',
	'Non-Smoking Area',
	'Pet Friendly',
	'Wheelchair Accessible',
	'Standing Table',
	'Outdoor Table',
	'Indoor Table',
	'VIP Table',
	'Private Table',
	'Air Conditioner',
	'Heater',
	'Elevator',
	'Parking Space',
	'Free Parking',
	'Free Wifi'
]
const hashtags: string[] = [
	'food',
	'delicious',
	'yummy',
	'foodie',
	'instafood',
	'restaurant',
	'dinner',
	'lunch'
]
const foodCategories: string[] = [
	'Drink',
	'Rice',
	'Noodles',
	'Soup',
	'Salad',
	'Sandwich',
	'Burger',
	'Pizza',
	'Cake',
	'Ice Cream',
	'Smoothie',
	'Juice',
	'Tea',
	'Coffee',
	'Alcohol'
]
const dummyProfilePicture: string[] = [
	'person_1.jpg',
	'person_2.jpg',
	'person_3.jpg',
	'person_4.jpg',
	'person_5.jpg',
	'person_6.jpg',
	'person_7.jpg'
]

export class FreshDatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const restaurantThemes: RestaurantThemeEntity[] = []
		const menuCategories: MenuCategoryEntity[] = []
		const postHashtags: PostHashtagEntity[] = []
		const reservationFacilities: ReservationFacilityEntity[] = []

		for (const theme of themeName) {
			restaurantThemes.push(em.create(RestaurantThemeEntity, { name: theme }))
		}

		for (const facility of reservationFacilitiesName) {
			reservationFacilities.push(
				em.create(ReservationFacilityEntity, {
					name: facility
				})
			)
		}

		for (const category of foodCategories) {
			const menuCategory = em.create(MenuCategoryEntity, { name: category })
			menuCategories.push(menuCategory)
		}

		for (const hashtag of hashtags) {
			const postHashtag = em.create(PostHashtagEntity, {
				tag: hashtag
			})
			postHashtags.push(postHashtag)
		}

		const adminUser = em.create(UserEntity, {
			name: 'admin',
			email: constants().ADMIN_EMAIL,
			password: constants().ADMIN_PASSWORD,
			phoneNumber: '081234567890',
			profilePictureUrl: `${constants().PROFILE_PICTURE_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.ADMIN
		})

		await em.flush()
	}
}
