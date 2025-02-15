import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { UserEntity, UserRole } from '../../modules/user/persistance/User.entity'
import { faker } from '@faker-js/faker'
import { RestaurantEntity } from '../../modules/restaurant/persistence/Restaurant.entity'
import { Point } from '../../modules/restaurant/persistence/custom-type/PointType'
import { CustomerEntity } from '../../modules/customer/persistence/Customer.entity'
import { BankEnum } from '../../enums/bank.enum'
import { RestaurantThemeEntity } from '../../modules/restaurant/persistence/restaurant-theme.entity'
import {
	PROFILE_PICTURE_UPLOADS_DIR,
	RESTAURANT_BANNER_UPLOADS_DIR,
	RESTAURANT_MENU_UPLOADS_DIR
} from '../../constants'
import { MenuCategoryEntity } from '../../modules/food-menu/persistence/menu-category.entity'
import { PostEntity } from '../../modules/post/persistence/post.entity'
import { POST_MEDIA_UPLOADS_DIR } from '../../constants'
import { PostMediaEntity } from '../../modules/post-media/persistence/post-media.entity'
import { PostHashtagEntity } from '../../modules/post-hashtag/persistence/post-hashtag.entity'
import { PostCommentEntity } from '../../modules/post-comment/persistence/post-comment.entity'
import { FoodMenuEntity } from '../../modules/food-menu/persistence/food-menu.entity'

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
	'Buffet'
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
const imagesMedias: string[] = [
	'post_dummy_image_1.jpg',
	'post_dummy_image_2.jpg',
	'post_dummy_image_3.jpg',
	'post_dummy_image_4.jpg',
	'post_dummy_image_5.jpg',
	'post_dummy_image_6.jpg',
	'post_dummy_image_7.jpg'
]
const videosMedias: string[] = [
	'post_dummy_video_1.mp4',
	'post_dummy_video_2.mp4',
	'post_dummy_video_3.mp4',
	'post_dummy_video_4.mp4',
	'post_dummy_video_5.mp4',
	'post_dummy_video_6.mp4',
	'post_dummy_video_7.mp4'
]
const videoThumbnails: string[] = [
	'post_thumbnail_1.png',
	'post_thumbnail_2.png',
	'post_thumbnail_3.png',
	'post_thumbnail_4.png',
	'post_thumbnail_5.png',
	'post_thumbnail_6.png',
	'post_thumbnail_7.png',
	'post_thumbnail_8.png'
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
const dummyRestaurantBanner: string[] = [
	'restaurant_1.jpg',
	'restaurant_2.jpg',
	'restaurant_3.jpg',
	'restaurant_4.jpg',
	'restaurant_5.jpg',
	'restaurant_6.jpg',
	'restaurant_7.jpg'
]
const dummyFoodMenuPicture: string[] = [
	'menu_1.jpg',
	'menu_2.jpg',
	'menu_3.jpg',
	'menu_4.jpg',
	'menu_5.jpg',
	'menu_6.jpg',
	'menu_7.jpg'
]
export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const restaurantThemes: RestaurantThemeEntity[] = []
		const menuCategories: MenuCategoryEntity[] = []
		const postHashtags: PostHashtagEntity[] = []
		const users: UserEntity[] = []
		const restaurants: RestaurantEntity[] = []
		const customers: CustomerEntity[] = []
		const posts: PostEntity[] = []
		const postComments: PostCommentEntity[] = []
		const menuDummies: FoodMenuEntity[] = []

		for (const theme of themeName) {
			restaurantThemes.push(em.create(RestaurantThemeEntity, { name: theme }))
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

		await em.flush()

		// Create Custom Customer and Restaurant User
		const customerUser = em.create(UserEntity, {
			name: 'customer1',
			email: 'customer1@gmail.com',
			phoneNumber: '081234567890',
			password: 'customer1',
			profilePictureUrl: `files/user/profile_picture/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.CUSTOMER
		})
		const customerUserData = em.create(CustomerEntity, {
			userData: customerUser.id,
			bio: faker.lorem.sentence(),
			wallet: 0
		})

		const restaurantUser = em.create(UserEntity, {
			name: 'restaurant1',
			email: 'restaurant1@gmail.com',
			phoneNumber: '081234567890',
			password: 'restaurant1',
			profilePictureUrl: `files/user/profile_picture/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.RESTAURANT
		})
		const restaurantRandomThemes = faker.helpers
			.shuffle([...restaurantThemes])
			.slice(0, 3)
			.map((theme) => theme)
		const restaurantUserData = em.create(RestaurantEntity, {
			userData: restaurantUser.id,
			location: new Point(faker.location.latitude(), faker.location.longitude()),
			restaurantBannerUrl: `files/user/restaurant_banner/dummy/${faker.helpers.arrayElement(dummyRestaurantBanner)}`,
			payoutBank: faker.helpers.arrayElement(bank) as BankEnum,
			accountNumber: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
			openTime: `${faker.number.int({ min: 0, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`,
			closeTime: `${faker.number.int({ min: 0, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`,
			themes: restaurantRandomThemes
		})
		users.push(customerUser, restaurantUser)
		customers.push(customerUserData)
		restaurants.push(restaurantUserData)

		for (let i = 0; i < 20; i++) {
			let role = UserRole.CUSTOMER
			if (faker.number.binary() === '1') {
				role = UserRole.RESTAURANT
			}

			// Create User Entity
			const user = em.create(UserEntity, {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				phoneNumber: faker.phone.number(),
				password: faker.internet.password(),
				profilePictureUrl: `files/user/profile_picture/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
				role: role
			})
			if (role === UserRole.RESTAURANT) {
				// Get 3 unique random themes by shuffling and slicing
				const randomThemes = faker.helpers
					.shuffle([...restaurantThemes])
					.slice(0, 3)
					.map((theme) => theme)

				// Create Restaurant Entity
				const restaurant = em.create(RestaurantEntity, {
					userData: user.id,
					location: new Point(faker.location.latitude(), faker.location.longitude()),
					restaurantBannerUrl: `files/user/restaurant_banner/dummy/${faker.helpers.arrayElement(dummyRestaurantBanner)}`,
					payoutBank: faker.helpers.arrayElement(bank) as BankEnum,
					accountNumber: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
					openTime: `${faker.number.int({ min: 0, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`,
					closeTime: `${faker.number.int({ min: 0, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`,
					themes: randomThemes
				})
				restaurants.push(restaurant)
			} else {
				// Create Customer Entity
				const customer = em.create(CustomerEntity, {
					userData: user.id,
					bio: faker.lorem.sentence(),
					wallet: 0
				})
				customers.push(customer)
			}
			users.push(user)
		}
		for (const user of users) {
			// Create 2-5 posts for each user
			const numberOfPosts = faker.number.int({ min: 100, max: 300 })

			for (let i = 0; i < numberOfPosts; i++) {
				// Generate random post resource
				const postMedias: PostMediaEntity[] = []
				const randomMedias = faker.helpers
					.shuffle([...imagesMedias, ...videosMedias])
					.slice(0, 3)
					.map((media) => media)
				const randomHashtags = faker.helpers
					.shuffle([...postHashtags])
					.slice(0, 3)
					.map((hashtag) => hashtag)

				// Create Post Entity
				const post = em.create(PostEntity, {
					user: user.id,
					title: faker.lorem.sentence({ min: 1, max: 5 }),
					caption: faker.lorem.paragraph(),
					location: faker.datatype.boolean()
						? new Point(faker.location.latitude(), faker.location.longitude())
						: null,
					hashtags: randomHashtags
				})

				// Create Post Media Entity
				for (let i = 0; i < faker.number.int({ min: 2, max: 10 }); i++) {
					const randomMedia = faker.helpers.arrayElement(randomMedias)
					const extension = randomMedia.substring(randomMedia.lastIndexOf('.') + 1)
					let type = 'image'
					if (extension.match(/(mp4|webm|ogg|mp3|wav|flac|aac)$/i)) {
						type = 'video'
					}
					let videoThumbnailUrl: string | undefined = undefined
					if (type === 'video') {
						videoThumbnailUrl = `files/post/thumbnails/dummy/${faker.helpers.arrayElement(videoThumbnails)}`
					}
					const postMedia = em.create(PostMediaEntity, {
						post: post.id,
						url: `files/post/${type}s/dummy/${randomMedia}`,
						type: type,
						extension: extension,
						videoThumbnailUrl: videoThumbnailUrl
					})
					postMedias.push(postMedia)
				}
				posts.push(post)

				// Create Post Comment Entity
				for (let i = 0; i < faker.number.int({ min: 0, max: 5 }); i++) {
					const postComment = em.create(PostCommentEntity, {
						post: post.id,
						text: faker.lorem.paragraph(),
						user: faker.helpers.arrayElement(
							users.filter((commentator) => commentator.id !== user.id)
						).id
					})
					postComments.push(postComment)
				}

				// Create Post Like
				for (let i = 0; i < faker.number.int({ min: 0, max: 5 }); i++) {
					post.postLikes.add(
						faker.helpers.arrayElement(users.filter((liker) => liker.id !== user.id))
					)
				}
			}

			const numberOfMenus = faker.number.int({ min: 10, max: 20 })
			for (let i = 0; i < numberOfMenus; i++) {
				if (user.role == UserRole.RESTAURANT) {
					const restaurant = user.restaurantData
					const menuDummyCategories = faker.helpers.shuffle(menuCategories).splice(0, 3)
					const menuDummy = em.create(FoodMenuEntity, {
						restaurant: restaurant?.id!,
						categories: menuDummyCategories,
						name: faker.food.dish(),
						price: faker.number.int({ min: 10000, max: 100000 }),
						description: faker.food.description(),
						pictureUrl: `files/menu/dummy/${faker.helpers.arrayElement(dummyFoodMenuPicture)}`,
						estimatedTime: faker.number.int({ min: 10, max: 60 }),
						isStockAvailable: true
					})
					menuDummies.push(menuDummy)
				}
			}
		}

		await em.flush()
	}
}
