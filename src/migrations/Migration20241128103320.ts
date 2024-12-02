import { Migration } from '@mikro-orm/migrations';

export class Migration20241128103320 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" alter column "photo_url" type varchar(255) using ("photo_url"::varchar(255));`);
    this.addSql(`alter table "restaurant" alter column "photo_url" set default '';`);

    this.addSql(`alter table "customer" alter column "photo_profile_url" type varchar(255) using ("photo_profile_url"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "photo_profile_url" set default '';`);
    this.addSql(`alter table "customer" alter column "bio" type text using ("bio"::text);`);
    this.addSql(`alter table "customer" alter column "bio" set default '';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" alter column "photo_url" drop default;`);
    this.addSql(`alter table "restaurant" alter column "photo_url" type varchar(255) using ("photo_url"::varchar(255));`);

    this.addSql(`alter table "customer" alter column "photo_profile_url" drop default;`);
    this.addSql(`alter table "customer" alter column "photo_profile_url" type varchar(255) using ("photo_profile_url"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "bio" drop default;`);
    this.addSql(`alter table "customer" alter column "bio" type text using ("bio"::text);`);
  }

}
