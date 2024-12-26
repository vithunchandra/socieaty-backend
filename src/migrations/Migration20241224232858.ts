import { Migration } from '@mikro-orm/migrations';

export class Migration20241224232858 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "post-media" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "url" varchar(255) not null, "type" varchar(255) not null, "post_id" uuid not null, constraint "post-media_pkey" primary key ("id"));`);
    this.addSql(`create index "post-media_post_id_index" on "post-media" ("post_id");`);

    this.addSql(`alter table "post-media" add constraint "post-media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "media" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "url" varchar(255) not null, "type" varchar(255) not null, "post_id" uuid not null, constraint "media_pkey" primary key ("id"));`);
    this.addSql(`create index "media_post_id_index" on "media" ("post_id");`);

    this.addSql(`alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`drop table if exists "post-media" cascade;`);
  }

}
