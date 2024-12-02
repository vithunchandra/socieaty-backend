import { Migration } from '@mikro-orm/migrations';

export class Migration20241125115107 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint "restaurant_user_id_foreign";`);

    this.addSql(`alter table "customer" drop constraint "customer_user_id_foreign";`);

    this.addSql(`alter table "restaurant" drop column "restaurant_name", drop column "restaurant_address";`);

    this.addSql(`alter table "restaurant" add column "name" varchar(255) not null, add column "location" point null;`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop default;`);
    this.addSql(`alter table "restaurant" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop not null;`);
    this.addSql(`alter table "restaurant" rename column "restaurant_photo_url" to "photo_url";`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "customer" alter column "user_id" drop default;`);
    this.addSql(`alter table "customer" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "customer" alter column "user_id" drop not null;`);
    this.addSql(`alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint "restaurant_user_id_foreign";`);

    this.addSql(`alter table "customer" drop constraint "customer_user_id_foreign";`);

    this.addSql(`alter table "restaurant" drop column "location";`);

    this.addSql(`alter table "restaurant" add column "restaurant_address" varchar(255) not null;`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop default;`);
    this.addSql(`alter table "restaurant" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "restaurant" alter column "user_id" set not null;`);
    this.addSql(`alter table "restaurant" rename column "name" to "restaurant_name";`);
    this.addSql(`alter table "restaurant" rename column "photo_url" to "restaurant_photo_url";`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "customer" alter column "user_id" drop default;`);
    this.addSql(`alter table "customer" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "customer" alter column "user_id" set not null;`);
    this.addSql(`alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
