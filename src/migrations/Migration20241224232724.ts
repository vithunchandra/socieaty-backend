import { Migration } from '@mikro-orm/migrations';

export class Migration20241224232724 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "post" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(255) null default '', "caption" varchar(255) not null, "location" point null, "user_id" uuid not null, constraint "post_pkey" primary key ("id"));`);

    this.addSql(`create table "post-like" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "post_id" uuid not null, "user_id" uuid not null, constraint "post-like_pkey" primary key ("id"));`);

    this.addSql(`create table "media" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "url" varchar(255) not null, "type" varchar(255) not null, "post_id" uuid not null, constraint "media_pkey" primary key ("id"));`);
    this.addSql(`create index "media_post_id_index" on "media" ("post_id");`);

    this.addSql(`create table "post_comment" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "text" varchar(255) not null, "likes" int null default 0, "post_id" uuid not null, "user_id" uuid not null, constraint "post_comment_pkey" primary key ("id"));`);

    this.addSql(`alter table "post" add constraint "post_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "post-like" add constraint "post-like_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post-like" add constraint "post-like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "post_comment" add constraint "post_comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_comment" add constraint "post_comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "user" add column "deleted_at" timestamptz null;`);

    this.addSql(`alter table "restaurant" add column "deleted_at" timestamptz null;`);
    this.addSql(`create index "restaurant_user_id_index" on "restaurant" ("user_id");`);

    this.addSql(`alter table "customer" add column "deleted_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post-like" drop constraint "post-like_post_id_foreign";`);

    this.addSql(`alter table "media" drop constraint "media_post_id_foreign";`);

    this.addSql(`alter table "post_comment" drop constraint "post_comment_post_id_foreign";`);

    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`drop table if exists "post-like" cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);

    this.addSql(`drop table if exists "post_comment" cascade;`);

    this.addSql(`alter table "user" drop column "deleted_at";`);

    this.addSql(`drop index "restaurant_user_id_index";`);
    this.addSql(`alter table "restaurant" drop column "deleted_at";`);

    this.addSql(`alter table "customer" drop column "deleted_at";`);
  }

}
