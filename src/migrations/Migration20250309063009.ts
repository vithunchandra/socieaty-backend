import { Migration } from '@mikro-orm/migrations';

export class Migration20250309063009 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "transaction_messages" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "message" varchar(255) not null, "user_id" uuid not null, "transaction_id" uuid not null, constraint "transaction_messages_pkey" primary key ("id"));`);
    this.addSql(`create index "transaction_messages_user_id_index" on "transaction_messages" ("user_id");`);
    this.addSql(`create index "transaction_messages_transaction_id_index" on "transaction_messages" ("transaction_id");`);

    this.addSql(`alter table "transaction_messages" add constraint "transaction_messages_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "transaction_messages" add constraint "transaction_messages_transaction_id_foreign" foreign key ("transaction_id") references "transactions" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "transaction_messages" cascade;`);
  }

}
