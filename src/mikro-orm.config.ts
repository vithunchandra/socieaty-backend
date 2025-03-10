import { Logger } from '@nestjs/common'
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import config from './database/config/config'
import { CustomerEntity } from './modules/customer/persistence/Customer.entity'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { UserEntity } from './modules/user/persistance/User.entity'
import { RestaurantEntity } from './modules/restaurant/persistence/Restaurant.entity'
import { PostCommentEntity } from './modules/post-comment/persistence/post-comment.entity'
import { PostEntity } from './modules/post/persistence/post.entity'
import { PostMediaEntity } from './modules/post-media/persistence/post-media.entity'
import { PostHashtagEntity } from './modules/post-hashtag/persistence/post-hashtag.entity'
import { LivestreamRoomCommentEntity } from './modules/livestream/persistence/livestream-room-comment.entity'
import { LivestreamRoomLikeEntity } from './modules/livestream/persistence/livestream-room-like.entity'
import { MikroOrmFilter } from './enums/mikro-orm-filter.enum'
import { RestaurantThemeEntity } from './modules/restaurant/persistence/restaurant-theme.entity'
import { FoodMenuEntity } from './modules/food-menu/persistence/food-menu.entity'
import { MenuCategoryEntity } from './modules/food-menu/persistence/menu-category.entity'
import { TransactionEntity } from './modules/transaction/persistence/entity/transaction.entity'
import { TransactionMenuItemEntity } from './modules/transaction/persistence/entity/transaction-menu-item.entity'
import { TransactionMessageEntity } from './modules/transaction-message/persistence/transaction-message.entity'
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
		TransactionMenuItemEntity,
		TransactionMessageEntity
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
		TransactionMenuItemEntity,
		TransactionMessageEntity
	],
	dbName: config().dbName ?? 'socieaty_database',
	driver: PostgreSqlDriver,
	port: config().port ?? 5432,
	name: config().name ?? 'postgres',
	password: config().password ?? 'root',
	debug: true,
	logger: logger.log.bind(logger),
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
				'TransactionMessageEntity'
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
				'TransactionMessageEntity'
			]
		}
	},
	metadataProvider: TsMorphMetadataProvider
})
