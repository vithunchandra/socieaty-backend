import { Logger } from '@nestjs/common';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from './database/config/config';
import { CustomerEntity } from './modules/customer/persistence/Customer.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { UserEntity } from './modules/user/persistance/User.entity';
import { RestaurantEntity } from './modules/restaurant/persistence/Restaurant.entity';
import { PostCommentEntity } from './modules/post-comment/persistence/post-comment.entity';
import { PostEntity } from './modules/post/persistence/post.entity';
import { PostMediaEntity } from './modules/post-media/persistence/post-media.entity';
import { PostHashtagEntity } from './modules/post-hashtag/persistence/post-hashtag.entity';
const logger = new Logger('MikroORM');

export default defineConfig({
    entities: [
      UserEntity, RestaurantEntity, CustomerEntity, PostEntity,
      PostCommentEntity, PostMediaEntity, PostHashtagEntity
    ],
    entitiesTs: [
      UserEntity, RestaurantEntity, CustomerEntity, PostEntity,
      PostCommentEntity, PostMediaEntity, PostHashtagEntity
    ],
    dbName: config().dbName ?? "socieaty_database",
    driver: PostgreSqlDriver,
    port: config().port ?? 5432,
    name: config().name ?? "postgres",
    password: config().password ?? "root",
    debug: true,
    logger: logger.log.bind(logger),
    seeder: {
      path: '/dist/database/seeder', // path to the folder with seeders
      pathTs: 'D:/Kuliah/Tugas_Akhir/Project/Backend/socieaty-backend/src/database/seeder', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
      defaultSeeder: 'DatabaseSeeder', // default seeder class name
      glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
      emit: 'ts', // seeder generation mode
      fileName: (className: string) => className, // seeder file naming convention
    },
    metadataProvider: TsMorphMetadataProvider,
});