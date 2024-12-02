import { Logger } from '@nestjs/common';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from './database/config/config';
import { Customer } from './modules/customer/persistence/Customer.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { UserEntity } from './modules/user/persistance/User.entity';
import { RestaurantEntity } from './modules/restaurant/persistence/Restaurant.entity';
const logger = new Logger('MikroORM');

export default defineConfig({
  entities: [UserEntity, RestaurantEntity, Customer],
  entitiesTs: [UserEntity, RestaurantEntity, Customer],
  dbName: config().dbName ?? "socieaty_database",
  driver: PostgreSqlDriver,
  port: config().port ?? 5432,
  name: config().name ?? "postgres",
  password: config().password ?? "root",
  debug: true,
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider
});