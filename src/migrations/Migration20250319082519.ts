import { Migration } from '@mikro-orm/migrations';

export class Migration20250319082519 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "reservation_facility" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, constraint "reservation_facility_pkey" primary key ("id"));`);

    this.addSql(`create table "reservation_facility_reservation_configs" ("reservation_facility_entity_id" uuid not null, "reservation_config_entity_id" uuid not null, constraint "reservation_facility_reservation_configs_pkey" primary key ("reservation_facility_entity_id", "reservation_config_entity_id"));`);

    this.addSql(`alter table "reservation_facility_reservation_configs" add constraint "reservation_facility_reservation_configs_reserva_01a26_foreign" foreign key ("reservation_facility_entity_id") references "reservation_facility" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "reservation_facility_reservation_configs" add constraint "reservation_facility_reservation_configs_reserva_4c639_foreign" foreign key ("reservation_config_entity_id") references "reservation_configs" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "reservation_configs" drop column "facilities";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reservation_facility_reservation_configs" drop constraint "reservation_facility_reservation_configs_reserva_01a26_foreign";`);

    this.addSql(`drop table if exists "reservation_facility" cascade;`);

    this.addSql(`drop table if exists "reservation_facility_reservation_configs" cascade;`);

    this.addSql(`alter table "reservation_configs" add column "facilities" text[] not null;`);
  }

}
