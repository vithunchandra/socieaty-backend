import { Migration } from '@mikro-orm/migrations';

export class Migration20241206064506 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint "restaurant_user_id_foreign";`);

    this.addSql(`alter table "customer" drop constraint "customer_user_id_foreign";`);

    this.addSql(`alter table "user" add column "name" varchar(255) not null;`);

    this.addSql(`alter table "restaurant" drop column "name";`);

    this.addSql(`alter table "restaurant" alter column "location" type point using ("location"::point);`);
    this.addSql(`alter table "restaurant" alter column "location" set not null;`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop default;`);
    this.addSql(`alter table "restaurant" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "restaurant" alter column "user_id" set not null;`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "customer" drop column "name";`);

    this.addSql(`alter table "customer" alter column "user_id" drop default;`);
    this.addSql(`alter table "customer" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "customer" alter column "user_id" set not null;`);
    this.addSql(`alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint "restaurant_user_id_foreign";`);

    this.addSql(`alter table "customer" drop constraint "customer_user_id_foreign";`);

    this.addSql(`alter table "user" drop column "name";`);

    this.addSql(`alter table "restaurant" add column "name" varchar(255) not null;`);
    this.addSql(`alter table "restaurant" alter column "location" type point using ("location"::point);`);
    this.addSql(`alter table "restaurant" alter column "location" drop not null;`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop default;`);
    this.addSql(`alter table "restaurant" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "restaurant" alter column "user_id" drop not null;`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "customer" add column "name" varchar(255) not null;`);
    this.addSql(`alter table "customer" alter column "user_id" drop default;`);
    this.addSql(`alter table "customer" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "customer" alter column "user_id" drop not null;`);
    this.addSql(`alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);
  }

}
