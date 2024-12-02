import { Migration } from '@mikro-orm/migrations';

export class Migration20240829135330 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "wallet" int not null default 0, "photo_url" varchar(255) null, "phone_number" varchar(255) not null, "bio" text null default \'\', constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
