import { Migration } from '@mikro-orm/migrations';

export class Migration20250318122608 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "reservations" drop constraint "reservations_restaurant_id_foreign";`);
    this.addSql(`alter table "reservations" drop constraint "reservations_customer_id_foreign";`);

    this.addSql(`alter table "restaurant" add column "is_reservation_available" boolean not null;`);

    this.addSql(`alter table "reservations" drop column "restaurant_id", drop column "customer_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop column "is_reservation_available";`);

    this.addSql(`alter table "reservations" add column "restaurant_id" uuid not null, add column "customer_id" uuid not null;`);
    this.addSql(`alter table "reservations" add constraint "reservations_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "reservations" add constraint "reservations_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);
  }

}
