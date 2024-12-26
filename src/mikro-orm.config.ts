import { Logger } from '@nestjs/common';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from './database/config/config';
import { CustomerEntity } from './modules/customer/persistence/Customer.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { UserEntity } from './modules/user/persistance/User.entity';
import { RestaurantEntity } from './modules/restaurant/persistence/Restaurant.entity';
import { PostCommentEntity } from './modules/post-comment/persistence/post-comment.entity';
import { PostLikeEntity } from './modules/post-likes/persistence/post-like.entity';
import { PostEntity } from './modules/post/persistence/post.entity';
import { PostMediaEntity } from './modules/post-media/persistence/media.entity';
const logger = new Logger('MikroORM');

export default defineConfig({
  entities: [
    UserEntity, RestaurantEntity, CustomerEntity, PostEntity,
    PostCommentEntity, PostLikeEntity, PostMediaEntity
  ],
  entitiesTs: [
    UserEntity, RestaurantEntity, CustomerEntity, PostEntity,
    PostCommentEntity, PostLikeEntity, PostMediaEntity
  ],
  dbName: config().dbName ?? "socieaty_database",
  driver: PostgreSqlDriver,
  port: config().port ?? 5432,
  name: config().name ?? "postgres",
  password: config().password ?? "root",
  debug: true,
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider
});