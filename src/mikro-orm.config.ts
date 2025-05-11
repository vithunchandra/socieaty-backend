import { Logger } from '@nestjs/common'
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import config from './database/config/config'
import { CustomerEntity } from './modules/customer/persistence/customer.entity'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { UserEntity } from './modules/user/persistance/user.entity'
import { RestaurantEntity } from './modules/restaurant/persistence/entity/restaurant.entity'
import { PostCommentEntity } from './modules/post-comment/persistence/post-comment.entity'
import { PostEntity } from './modules/post/persistence/post.entity'
import { PostMediaEntity } from './modules/post-media/persistence/post-media.entity'
import { PostHashtagEntity } from './modules/post-hashtag/persistence/post-hashtag.entity'
import { LivestreamRoomCommentEntity } from './modules/livestream/persistence/livestream-room-comment.entity'
import { LivestreamRoomLikeEntity } from './modules/livestream/persistence/livestream-room-like.entity'
import { MikroOrmFilter } from './enums/mikro-orm-filter.enum'
import { RestaurantThemeEntity } from './modules/restaurant/persistence/entity/restaurant-theme.entity'
import { FoodMenuEntity } from './modules/food-menu/persistence/food-menu.entity'
import { MenuCategoryEntity } from './modules/food-menu/persistence/menu-category.entity'
import { TransactionEntity } from './modules/transaction/persistence/transaction.entity'
import { MenuItemEntity } from './modules/menu-items/persistence/menu-item.entity'
import { TransactionMessageEntity } from './modules/transaction-message/persistence/transaction-message.entity'
import { FoodOrderEntity } from './modules/food-order-transaction/persistence/entity/food-order-transaction.entity'
import { ReservationEntity } from './modules/reservation/persistence/reservation.entity'
import { ReservationConfigEntity } from './modules/restaurant/persistence/entity/reservation-config.entity'
import { ReservationFacilityEntity } from './modules/restaurant/persistence/entity/reservation-facility.entity'
import { TopupEntity } from './modules/topup/persistence/topup.entity'
import { SupportTicketEntity } from './modules/support-ticket/persistence/support-ticket.entity'
import { SupportTicketMessageEntity } from './modules/support-ticket/persistence/support-ticket-message.entity'
const logger = new Logger('MikroORM')

export default defineConfig({
	entities: [
		UserEntity,
		RestaurantEntity,
		CustomerEntity,
		PostEntity,
		PostCommentEntity,
		PostMediaEntity,
		PostHashtagEntity,
		LivestreamRoomCommentEntity,
		LivestreamRoomLikeEntity,
		RestaurantThemeEntity,
		FoodMenuEntity,
		MenuCategoryEntity,
		TransactionEntity,
		MenuItemEntity,
		TransactionMessageEntity,
		FoodOrderEntity,
		ReservationEntity,
		ReservationConfigEntity,
		ReservationFacilityEntity,
		TopupEntity,
		SupportTicketEntity,
		SupportTicketMessageEntity
	],
	entitiesTs: [
		UserEntity,
		RestaurantEntity,
		CustomerEntity,
		PostEntity,
		PostCommentEntity,
		PostMediaEntity,
		PostHashtagEntity,
		LivestreamRoomCommentEntity,
		LivestreamRoomLikeEntity,
		RestaurantThemeEntity,
		FoodMenuEntity,
		MenuCategoryEntity,
		TransactionEntity,
		MenuItemEntity,
		TransactionMessageEntity,
		FoodOrderEntity,
		ReservationEntity,
		ReservationConfigEntity,
		ReservationFacilityEntity,
		TopupEntity,
		SupportTicketEntity,
		SupportTicketMessageEntity
	],
	dbName: config().dbName ?? 'socieaty_database',
	driver: PostgreSqlDriver,
	host: config().host ?? 'localhost',
	port: config().port ?? 5432,
	name: config().name ?? 'postgres',
	password: config().password ?? 'root',
	debug: true,
	logger: logger.log.bind(logger),
	forceUtcTimezone: true,
	seeder: {
		path: '/dist/database/seeder', // path to the folder with seeders
		pathTs: 'D:/Kuliah/Tugas_Akhir/Project/Backend/socieaty-backend/src/database/seeder', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
		defaultSeeder: 'DatabaseSeeder', // default seeder class name
		glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
		emit: 'ts', // seeder generation mode
		fileName: (className: string) => className // seeder file naming convention
	},
	filters: {
		[MikroOrmFilter.EXISTS]: {
			cond: {
				deletedAt: null
			},
			default: true,
			entity: [
				'UserEntity',
				'RestaurantEntity',
				'CustomerEntity',
				'PostEntity',
				'PostCommentEntity',
				'PostMediaEntity',
				'PostHashtagEntity',
				'LivestreamRoomCommentEntity',
				'LivestreamRoomLikeEntity',
				'FoodMenuEntity',
				'TransactionMessageEntity',
				'FoodOrderEntity',
				'TransactionMenuItemEntity',
				'ReservationEntity',
				'ReservationConfigEntity',
				'ReservationFacilityEntity',
				'SupportTicketEntity',
				'SupportTicketMessageEntity'
			]
		},
		[MikroOrmFilter.DELETED]: {
			cond: {
				deletedAt: { $ne: null }
			},
			default: false,
			entity: [
				'UserEntity',
				'RestaurantEntity',
				'CustomerEntity',
				'PostEntity',
				'PostCommentEntity',
				'PostMediaEntity',
				'PostHashtagEntity',
				'LivestreamRoomCommentEntity',
				'LivestreamRoomLikeEntity',
				'FoodMenuEntity',
				'TransactionMessageEntity',
				'FoodOrderEntity',
				'TransactionMenuItemEntity',
				'ReservationEntity',
				'ReservationConfigEntity',
				'ReservationFacilityEntity',
				'SupportTicketEntity',
				'SupportTicketMessageEntity'
			]
		}
	},
	metadataProvider: TsMorphMetadataProvider
})
