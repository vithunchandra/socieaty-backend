import { Migration } from '@mikro-orm/migrations';

export class Migration20250405071156 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "topups" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "transaction_id" varchar(255) null, "amount" int not null, "status" text check ("status" in ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED')) not null, "payment_type" varchar(255) null, "settlement_time" timestamptz null, "customer_id" uuid not null, constraint "topups_pkey" primary key ("id"));`);

    this.addSql(`alter table "topups" add constraint "topups_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "topups" cascade;`);
  }

}
