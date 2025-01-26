import { Migration } from '@mikro-orm/migrations';

export class Migration20250125111525 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "livestream-room-like" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "room_name" varchar(255) not null, "user_id" uuid not null, constraint "livestream-room-like_pkey" primary key ("id"));`);

    this.addSql(`create table "livestream-room-comment" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "room_name" varchar(255) not null, "user_id" uuid not null, "text" varchar(255) not null, constraint "livestream-room-comment_pkey" primary key ("id"));`);

    this.addSql(`alter table "livestream-room-like" add constraint "livestream-room-like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "livestream-room-comment" add constraint "livestream-room-comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "livestream-room-like" cascade;`);

    this.addSql(`drop table if exists "livestream-room-comment" cascade;`);
  }

}
