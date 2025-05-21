import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { UserEntity, UserRole } from '../../modules/user/persistance/user.entity'
import { faker } from '@faker-js/faker'
import { RestaurantEntity } from '../../modules/restaurant/persistence/entity/restaurant.entity'
import { Point } from '../../modules/restaurant/persistence/custom-type/point-type'
import { CustomerEntity } from '../../modules/customer/persistence/customer.entity'
import { BankEnum } from '../../enums/bank.enum'
import { RestaurantThemeEntity } from '../../modules/restaurant/persistence/entity/restaurant-theme.entity'
import { MenuCategoryEntity } from '../../modules/food-menu/persistence/menu-category.entity'
import { PostEntity } from '../../modules/post/persistence/post.entity'
import { PostMediaEntity } from '../../modules/post-media/persistence/post-media.entity'
import { PostCommentEntity } from '../../modules/post-comment/persistence/post-comment.entity'
import { FoodMenuEntity } from '../../modules/food-menu/persistence/food-menu.entity'
import { ReservationFacilityEntity } from '../../modules/restaurant/persistence/entity/reservation-facility.entity'
import { RestaurantVerificationStatus } from '../../enums/restaurant-verification-status.enum'
import { TransactionEntity } from '../../modules/transaction/persistence/transaction.entity'
import { TransactionServiceType, TransactionStatus } from '../../enums/transaction.enum'
import { ReservationEntity } from '../../modules/reservation/persistence/reservation.entity'
import { ReservationStatus } from '../../enums/reservation.enum'
import { ReservationConfigEntity } from '../../modules/restaurant/persistence/entity/reservation-config.entity'
import { MenuItemEntity } from '../../modules/menu-items/persistence/menu-item.entity'
import { FoodMenuCartDto } from '../../modules/food-order-transaction/persistence/dto/food-menu-cart.dto'
import { FoodOrderEntity } from '../../modules/food-order-transaction/persistence/entity/food-order-transaction.entity'
import { FoodOrderStatus } from '../../enums/food-order.enum'
import constants from '../../constants'
import { PostHashtagEntity } from '../../modules/post-hashtag/persistence/post-hashtag.entity'

const bank: BankEnum[] = [BankEnum.BNI, BankEnum.BCA, BankEnum.BRI, BankEnum.MANDIRI]
class Medias {
	media: string
	thumbnail?: string
}

const surabayaCoordinates = [
	{ latitude: -7.2575, longitude: 112.7521 }, // Surabaya City Center
	{ latitude: -7.2764, longitude: 112.7911 }, // Surabaya East
	{ latitude: -7.2133, longitude: 112.7297 }, // Surabaya North
	{ latitude: -7.3196, longitude: 112.7272 }, // Surabaya South
	{ latitude: -7.2744, longitude: 112.6812 }, // Surabaya West
	{ latitude: -7.2662, longitude: 112.7455 }, // Tunjungan Plaza
	{ latitude: -7.2756, longitude: 112.7536 }, // Grand City Mall
	{ latitude: -7.2653, longitude: 112.7378 }, // Surabaya Town Square
	{ latitude: -7.2901, longitude: 112.7682 }, // Royal Plaza
	{ latitude: -7.2883, longitude: 112.7239 }, // Ciputra World
	{ latitude: -7.2628, longitude: 112.7315 }, // Pasar Turi Station
	{ latitude: -7.2651, longitude: 112.7513 }, // Gubeng Station
	{ latitude: -7.312, longitude: 112.7321 }, // Wonokromo Station
	{ latitude: -7.2393, longitude: 112.7432 }, // Kenjeran Beach
	{ latitude: -7.2134, longitude: 112.7466 }, // Suramadu Bridge
	{ latitude: -7.226, longitude: 112.7175 }, // Port of Tanjung Perak
	{ latitude: -7.3244, longitude: 112.7685 }, // Juanda International Airport
	{ latitude: -7.3055, longitude: 112.7381 }, // Surabaya Zoo
	{ latitude: -7.2646, longitude: 112.7458 }, // Siola Building
	{ latitude: -7.2568, longitude: 112.7511 }, // Majapahit Hotel
	{ latitude: -7.2943, longitude: 112.7199 }, // Pakuwon Mall
	{ latitude: -7.2611, longitude: 112.7298 }, // Red Bridge (Jembatan Merah)
	{ latitude: -7.2501, longitude: 112.7682 }, // Kya Kya Kembang Jepun
	{ latitude: -7.2651, longitude: 112.7422 }, // Submarine Monument
	{ latitude: -7.2714, longitude: 112.7331 }, // House of Sampoerna
	{ latitude: -7.2324, longitude: 112.7418 }, // Suramadu National Bridge
	{ latitude: -7.268, longitude: 112.7414 }, // Grahadi Building
	{ latitude: -7.2647, longitude: 112.7467 }, // Tugu Pahlawan
	{ latitude: -7.2589, longitude: 112.7522 }, // Balai Pemuda
	{ latitude: -7.2601, longitude: 112.7382 }, // Chinese Temple Hok An Kiong
	{ latitude: -7.2863, longitude: 112.6851 }, // Citraland
	{ latitude: -7.2752, longitude: 112.724 }, // Taman Bungkul
	{ latitude: -7.2639, longitude: 112.7452 }, // Genteng Market
	{ latitude: -7.2637, longitude: 112.7483 }, // Santa Maria Catholic Church
	{ latitude: -7.2436, longitude: 112.7374 }, // Al Akbar Mosque
	{ latitude: -7.2897, longitude: 112.765 }, // DBL Arena
	{ latitude: -7.2656, longitude: 112.7501 }, // Surabaya Grand Mosque
	{ latitude: -7.2592, longitude: 112.7526 }, // Surabaya Central Post Office
	{ latitude: -7.264, longitude: 112.7449 }, // Siola Museum
	{ latitude: -7.2912, longitude: 112.7276 }, // City of Tomorrow Mall
	{ latitude: -7.2654, longitude: 112.7378 }, // BG Junction Mall
	{ latitude: -7.2433, longitude: 112.7384 }, // Kenjeran Park
	{ latitude: -7.2689, longitude: 112.7523 }, // Surabaya Plaza Shopping Center
	{ latitude: -7.275, longitude: 112.7422 }, // Surabaya Contemporary Art Gallery
	{ latitude: -7.2663, longitude: 112.7163 }, // Pasar Atom Shopping Center
	{ latitude: -7.3071, longitude: 112.7676 }, // East Coast Center
	{ latitude: -7.2933, longitude: 112.7063 }, // University of Airlangga
	{ latitude: -7.276, longitude: 112.7933 }, // Manyar District
	{ latitude: -7.3215, longitude: 112.7682 }, // Waru District
	{ latitude: -7.3128, longitude: 112.779 }, // Gayungan District
	{ latitude: -7.2393, longitude: 112.785 }, // Mulyorejo District
	{ latitude: -7.229, longitude: 112.7612 }, // Kenjeran District
	{ latitude: -7.2548, longitude: 112.7681 }, // Tambaksari District
	{ latitude: -7.2631, longitude: 112.7516 }, // Gubeng District
	{ latitude: -7.2474, longitude: 112.7326 }, // Simokerto District
	{ latitude: -7.24, longitude: 112.7158 }, // Pabean Cantian District
	{ latitude: -7.2574, longitude: 112.7397 }, // Genteng District
	{ latitude: -7.2708, longitude: 112.7214 }, // Sawahan District
	{ latitude: -7.2897, longitude: 112.7155 }, // Dukuh Pakis District
	{ latitude: -7.299, longitude: 112.7384 }, // Wonokromo District
	{ latitude: -7.326, longitude: 112.7193 }, // Karang Pilang District
	{ latitude: -7.3392, longitude: 112.7005 }, // Gunung Anyar District
	{ latitude: -7.325, longitude: 112.6865 }, // Jambangan District
	{ latitude: -7.2826, longitude: 112.6793 }, // Sukomanunggal District
	{ latitude: -7.258, longitude: 112.6855 }, // Tandes District
	{ latitude: -7.2343, longitude: 112.6954 }, // Asemrowo District
	{ latitude: -7.2447, longitude: 112.7208 }, // Krembangan District
	{ latitude: -7.2516, longitude: 112.7108 }, // Semampir District
	{ latitude: -7.2187, longitude: 112.7219 }, // Bulak District
	{ latitude: -7.2682, longitude: 112.7778 }, // Sukolilo District
	{ latitude: -7.3015, longitude: 112.7675 }, // Tenggilis Mejoyo District
	{ latitude: -7.2912, longitude: 112.8055 }, // Rungkut District
	{ latitude: -7.2534, longitude: 112.798 }, // Surabaya Industrial Estate Rungkut
	{ latitude: -7.2648, longitude: 112.7399 }, // Jalan Tunjungan
	{ latitude: -7.256, longitude: 112.751 }, // Jalan Basuki Rahmat
	{ latitude: -7.2649, longitude: 112.7473 }, // Jalan Pemuda
	{ latitude: -7.2663, longitude: 112.753 }, // Jalan Panglima Sudirman
	{ latitude: -7.2774, longitude: 112.79 }, // Galaxy Mall
	{ latitude: -7.2754, longitude: 112.7841 }, // Marvell City
	{ latitude: -7.286, longitude: 112.7603 }, // ITC Surabaya
	{ latitude: -7.2748, longitude: 112.7321 }, // Hi-Tech Mall
	{ latitude: -7.2584, longitude: 112.7517 }, // World Trade Center Surabaya
	{ latitude: -7.2885, longitude: 112.7384 }, // Darmo Hospital
	{ latitude: -7.2641, longitude: 112.7494 }, // Dr. Soetomo Hospital
	{ latitude: -7.2721, longitude: 112.765 }, // Siloam Hospital
	{ latitude: -7.2659, longitude: 112.7425 }, // Surabaya City Hall
	{ latitude: -7.2667, longitude: 112.7432 }, // Surabaya Provincial Government Office
	{ latitude: -7.2765, longitude: 112.7943 }, // SCTV Studio
	{ latitude: -7.2645, longitude: 112.7453 }, // Bank Indonesia Building
	{ latitude: -7.2645, longitude: 112.7459 }, // Mandiri Bank Building
	{ latitude: -7.2932, longitude: 112.7056 }, // Institut Teknologi Sepuluh Nopember
	{ latitude: -7.2668, longitude: 112.7479 }, // Surabaya State University
	{ latitude: -7.2641, longitude: 112.7465 }, // Balai Kota Park
	{ latitude: -7.2646, longitude: 112.7474 }, // Apsari Park
	{ latitude: -7.2947, longitude: 112.7374 }, // Flora Park
	{ latitude: -7.2735, longitude: 112.7374 }, // Prestasi Park
	{ latitude: -7.2767, longitude: 112.7264 }, // Kayoon Flower Market
	{ latitude: -7.2656, longitude: 112.7456 }, // Surabaya Cathedral
	{ latitude: -7.2492, longitude: 112.739 }, // Cheng Ho Mosque
	{ latitude: -7.2593, longitude: 112.7361 }, // Ampel Mosque
	{ latitude: -7.2696, longitude: 112.7385 } // Surabaya Theatre Building
]

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
const imagesMedias: Medias[] = [
	{
		media: 'post_dummy_image_1.jpg'
	},
	{
		media: 'post_dummy_image_2.jpg'
	},
	{
		media: 'post_dummy_image_3.jpg'
	},
	{
		media: 'post_dummy_image_4.jpg'
	},
	{
		media: 'post_dummy_image_5.jpg'
	},
	{
		media: 'post_dummy_image_6.jpg'
	},
	{
		media: 'post_dummy_image_7.jpg'
	}
]
const videosMedias: Medias[] = [
	{
		media: 'post_dummy_video_1.mp4',
		thumbnail: 'post_thumbnail_1.png'
	},
	{
		media: 'post_dummy_video_2.mp4',
		thumbnail: 'post_thumbnail_2.png'
	},
	{
		media: 'post_dummy_video_3.mp4',
		thumbnail: 'post_thumbnail_3.png'
	},
	{
		media: 'post_dummy_video_4.mp4',
		thumbnail: 'post_thumbnail_4.png'
	},
	{
		media: 'post_dummy_video_5.mp4',
		thumbnail: 'post_thumbnail_5.png'
	},
	{
		media: 'post_dummy_video_6.mp4',
		thumbnail: 'post_thumbnail_6.png'
	},
	{
		media: 'post_dummy_video_7.mp4',
		thumbnail: 'post_thumbnail_7.png'
	},
	{
		media: 'post_dummy_video_8.mp4',
		thumbnail: 'post_thumbnail_8.png'
	}
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

		await em.flush()

		const adminUser = em.create(UserEntity, {
			name: 'admin',
			email: constants().ADMIN_EMAIL,
			password: constants().ADMIN_PASSWORD,
			phoneNumber: '081234567890',
			profilePictureUrl: `${constants().PROFILE_PICTURE_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.ADMIN
		})

		// Create Custom Customer and Restaurant User
		const customerUser = em.create(UserEntity, {
			name: 'customer1',
			email: 'customer1@gmail.com',
			phoneNumber: '081234567890',
			password: 'customer1',
			profilePictureUrl: `${constants().PROFILE_PICTURE_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.CUSTOMER
		})
		const customerUserData = em.create(CustomerEntity, {
			userData: customerUser.id,
			bio: faker.lorem.sentence(),
			wallet: 999999999
		})

		const restaurantUser = em.create(UserEntity, {
			name: 'restaurant1',
			email: 'restaurant1@gmail.com',
			phoneNumber: '081234567890',
			password: 'restaurant1',
			profilePictureUrl: `${constants().PROFILE_PICTURE_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
			role: UserRole.RESTAURANT
		})
		const restaurantRandomThemes = faker.helpers
			.shuffle([...restaurantThemes])
			.slice(0, 3)
			.map((theme) => theme)
		const openTime = `${faker.number.int({ min: 0, max: 21 })}:${faker.number.int({ min: 0, max: 59 })}`
		const closeTime = `${faker.number.int({ min: parseInt(openTime.split(':')[0]) + 1, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`
		const restaurantUserData = em.create(RestaurantEntity, {
			userData: restaurantUser.id,
			wallet: 0,
			location: new Point(
				faker.helpers.arrayElement(surabayaCoordinates).latitude,
				faker.helpers.arrayElement(surabayaCoordinates).longitude
			),
			restaurantBannerUrl: `${constants().RESTAURANT_BANNER_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyRestaurantBanner)}`,
			payoutBank: faker.helpers.arrayElement(bank) as BankEnum,
			accountNumber: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
			openTime: openTime,
			closeTime: closeTime,
			themes: restaurantRandomThemes,
			isReservationAvailable: false,
			verificationStatus: RestaurantVerificationStatus.VERIFIED
		})
		users.push(customerUser, restaurantUser)
		customers.push(customerUserData)
		restaurants.push(restaurantUserData)

		for (let i = 0; i < 100; i++) {
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
				profilePictureUrl: `${constants().PROFILE_PICTURE_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyProfilePicture)}`,
				role: role
			})
			if (role === UserRole.RESTAURANT) {
				// Get 3 unique random themes by shuffling and slicing
				const randomThemes = faker.helpers
					.shuffle([...restaurantThemes])
					.slice(0, 3)
					.map((theme) => theme)

				const openTime = `${faker.number.int({ min: 0, max: 21 })}:${faker.number.int({ min: 0, max: 59 })}`
				const closeTime = `${faker.number.int({ min: parseInt(openTime.split(':')[0]) + 1, max: 23 })}:${faker.number.int({ min: 0, max: 59 })}`
				// Create Restaurant Entity
				const restaurant = em.create(RestaurantEntity, {
					userData: user.id,
					wallet: 0,
					location: new Point(
						faker.helpers.arrayElement(surabayaCoordinates).latitude,
						faker.helpers.arrayElement(surabayaCoordinates).longitude
					),
					restaurantBannerUrl: `${constants().RESTAURANT_BANNER_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyRestaurantBanner)}`,
					payoutBank: faker.helpers.arrayElement(bank) as BankEnum,
					accountNumber: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
					openTime: openTime,
					closeTime: closeTime,
					themes: randomThemes,
					isReservationAvailable: false,
					verificationStatus: RestaurantVerificationStatus.VERIFIED
				})

				const isReservationAvailable = faker.datatype.boolean()
				restaurant.isReservationAvailable = isReservationAvailable

				if (isReservationAvailable) {
					const reservationConfig = em.create(ReservationConfigEntity, {
						restaurant: restaurant.id,
						timeLimit: 120,
						maxPerson: faker.number.int({ min: 10, max: 40 }),
						minCostPerPerson: faker.number.int({ min: 15000, max: 100000 })
					})

					const reservationConfigFacilities =
						faker.helpers.arrayElement(reservationFacilities)
					reservationConfig.facilities.add(reservationConfigFacilities)
				}

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
			const numberOfPosts = faker.number.int({ min: 5, max: 10 })

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
						? new Point(
								faker.helpers.arrayElement(surabayaCoordinates).latitude,
								faker.helpers.arrayElement(surabayaCoordinates).longitude
							)
						: null,
					hashtags: randomHashtags
				})

				// Create Post Media Entity
				for (let i = 0; i < faker.number.int({ min: 2, max: 10 }); i++) {
					const randomMedia = faker.helpers.arrayElement(randomMedias)

					const extension = randomMedia.media.substring(
						randomMedia.media.lastIndexOf('.') + 1
					)
					let type = 'image'
					if (extension.match(/(mp4|webm|ogg|mp3|wav|flac|aac)$/i)) {
						type = 'video'
					}
					let videoThumbnailUrl: string | undefined = undefined
					if (type === 'video') {
						videoThumbnailUrl = `${constants().POST_MEDIA_RELATIVE_URL}/thumbnails/dummy/${randomMedia.thumbnail}`
					}
					const postMedia = em.create(PostMediaEntity, {
						post: post.id,
						url: `${constants().POST_MEDIA_RELATIVE_URL}/${type}s/dummy/${randomMedia.media}`,
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
						pictureUrl: `${constants().RESTAURANT_MENU_RELATIVE_URL}/dummy/${faker.helpers.arrayElement(dummyFoodMenuPicture)}`,
						estimatedTime: faker.number.int({ min: 10, max: 60 }),
						isStockAvailable: true
					})
					menuDummies.push(menuDummy)
				}
			}
		}

		for (const customer of customers) {
			const numberOfTransactions = faker.number.int({ min: 1, max: 10 })
			for (let i = 0; i < numberOfTransactions; i++) {
				const restaurant = faker.helpers.arrayElement(restaurants)
				const serviceType = faker.helpers.arrayElement(
					Object.values(TransactionServiceType)
				)

				if (
					serviceType === TransactionServiceType.RESERVATION &&
					!restaurant.isReservationAvailable
				) {
					continue
				}

				const restaurantMenus = await em.find(FoodMenuEntity, {
					restaurant: restaurant.id
				})
				const selectedMenuItems = faker.helpers
					.arrayElements(restaurantMenus, faker.number.int({ min: 1, max: 3 }))
					.map((menu) => new FoodMenuCartDto(menu, faker.number.int({ min: 1, max: 10 })))

				const amount = selectedMenuItems.reduce(
					(acc, curr) => acc + curr.menu.price * curr.quantity,
					0
				)
				const transactionStatus = faker.helpers.arrayElement(
					Object.values(TransactionStatus)
				)

				const transaction = em.create(TransactionEntity, {
					customer: customer.id,
					restaurant: restaurant.id,
					grossAmount: amount + constants().SERVICE_FEE,
					netAmount: amount,
					serviceFee: constants().SERVICE_FEE,
					refundAmount: 0,
					note: faker.lorem.sentence(),
					serviceType: serviceType,
					status: transactionStatus
				})

				transaction.createdAt = faker.date.recent({ days: 90 })
				if (
					transactionStatus === TransactionStatus.SUCCESS ||
					transactionStatus === TransactionStatus.FAILED
				) {
					transaction.finishedAt = faker.date.recent({ refDate: transaction.createdAt })
				}

				if (serviceType === TransactionServiceType.RESERVATION) {
					const reservationTime = faker.date.recent({ refDate: transaction.createdAt })

					let reservationStatus = ReservationStatus.PENDING
					if (transactionStatus === TransactionStatus.SUCCESS) {
						reservationStatus = ReservationStatus.COMPLETED
					} else if (transactionStatus === TransactionStatus.FAILED) {
						reservationStatus = ReservationStatus.REJECTED
					} else if (transactionStatus === TransactionStatus.REFUNDED) {
						reservationStatus = ReservationStatus.CANCELED
					}

					const reservation = em.create(ReservationEntity, {
						transaction: transaction.id,
						peopleSize: faker.number.int({ min: 1, max: 10 }),
						reservationTime: reservationTime,
						status: reservationStatus,
						endTimeEstimation: new Date(
							reservationTime.getTime() +
								1000 * 60 * faker.number.int({ min: 30, max: 90 })
						)
					})
					for (const menuItem of selectedMenuItems) {
						em.create(MenuItemEntity, {
							menu: menuItem.menu.id,
							quantity: menuItem.quantity,
							price: menuItem.menu.price,
							totalPrice: menuItem.menu.price * menuItem.quantity,
							reservation: reservation.id
						})
					}
				} else {
					let foodOrderStatus = FoodOrderStatus.PENDING
					if (transactionStatus === TransactionStatus.SUCCESS) {
						foodOrderStatus = FoodOrderStatus.COMPLETED
					} else if (transactionStatus === TransactionStatus.FAILED) {
						foodOrderStatus = FoodOrderStatus.REJECTED
					} else if (transactionStatus === TransactionStatus.ONGOING) {
						foodOrderStatus = FoodOrderStatus.PREPARING
					} else if (transactionStatus === TransactionStatus.REFUNDED) {
						foodOrderStatus = FoodOrderStatus.COMPLETED
					}

					const foodOrder = em.create(FoodOrderEntity, {
						transaction: transaction.id,
						status: foodOrderStatus
					})

					for (const menuItem of selectedMenuItems) {
						em.create(MenuItemEntity, {
							menu: menuItem.menu.id,
							quantity: menuItem.quantity,
							price: menuItem.menu.price,
							totalPrice: menuItem.menu.price * menuItem.quantity,
							foodOrder: foodOrder.id
						})
					}
				}
			}
		}

		await em.flush()
	}
}
