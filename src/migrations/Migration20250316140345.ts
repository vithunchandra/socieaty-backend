import { Migration } from '@mikro-orm/migrations';

export class Migration20250316140345 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "reservation_configs" add constraint "reservation_configs_restaurant_id_unique" unique ("restaurant_id");`);

    this.addSql(`alter table "reservations" drop column "end_time";`);

    this.addSql(`alter table "reservations" add column "end_time_estimation" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reservation_configs" drop constraint "reservation_configs_restaurant_id_unique";`);

    this.addSql(`alter table "reservations" drop column "end_time_estimation";`);

    this.addSql(`alter table "reservations" add column "end_time" timestamptz null;`);
  }

}
