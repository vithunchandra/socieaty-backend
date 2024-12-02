import { Migration } from '@mikro-orm/migrations';

export class Migration20240901103803 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "customer" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "photo_profile_url" varchar(255) null, "bio" text null, "wallet" int not null default 0, constraint "customer_pkey" primary key ("id"));');

    this.addSql('create table "restaurant" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "restaurant_name" varchar(255) not null, "restaurant_photo_url" varchar(255) null, "restaurant_address" varchar(255) not null, constraint "restaurant_pkey" primary key ("id"));');

    this.addSql('alter table "user" drop column "name", drop column "wallet", drop column "photo_url", drop column "bio";');

    this.addSql('alter table "user" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null, add column "restaurant_data_id" uuid null, add column "customer_data_id" uuid null;');
    this.addSql('alter table "user" add constraint "user_restaurant_data_id_foreign" foreign key ("restaurant_data_id") references "restaurant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_customer_data_id_foreign" foreign key ("customer_data_id") references "customer" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_restaurant_data_id_unique" unique ("restaurant_data_id");');
    this.addSql('alter table "user" add constraint "user_customer_data_id_unique" unique ("customer_data_id");');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_customer_data_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_restaurant_data_id_foreign";');

    this.addSql('drop table if exists "customer" cascade;');

    this.addSql('drop table if exists "restaurant" cascade;');

    this.addSql('alter table "user" drop constraint "user_restaurant_data_id_unique";');
    this.addSql('alter table "user" drop constraint "user_customer_data_id_unique";');
    this.addSql('alter table "user" drop column "created_at", drop column "updated_at", drop column "restaurant_data_id", drop column "customer_data_id";');

    this.addSql('alter table "user" add column "name" varchar(255) not null, add column "wallet" int not null default 0, add column "photo_url" varchar(255) null, add column "bio" text null default \'\';');
  }

}
