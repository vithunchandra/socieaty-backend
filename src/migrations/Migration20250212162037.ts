import { Migration } from '@mikro-orm/migrations';

export class Migration20250212162037 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "menu_category" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "post_hashtag" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "tag" varchar(255) not null, constraint "post_hashtag_pkey" primary key ("id"));`);
    this.addSql(`alter table "post_hashtag" add constraint "post_hashtag_tag_unique" unique ("tag");`);

    this.addSql(`create table "restaurant_theme" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "phone_number" varchar(255) not null, "profile_picture_url" varchar(255) null, "role" text check ("role" in ('Admin', 'Customer', 'Restaurant')) not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "restaurant" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "restaurant_banner_url" varchar(255) null default '', "location" point not null, "open_time" varchar(255) not null, "close_time" varchar(255) not null, "payout_bank" text check ("payout_bank" in ('bni', 'bri', 'bca', 'mandiri')) not null, "account_number" varchar(255) not null, "user_id" uuid not null, constraint "restaurant_pkey" primary key ("id"));`);
    this.addSql(`create index "restaurant_user_id_index" on "restaurant" ("user_id");`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "restaurant_theme_restaurants" ("restaurant_theme_entity_id" int not null, "restaurant_entity_id" uuid not null, constraint "restaurant_theme_restaurants_pkey" primary key ("restaurant_theme_entity_id", "restaurant_entity_id"));`);

    this.addSql(`create table "food_menu" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "picture_url" varchar(255) not null, "estimated_time" int not null, "is_stock_available" boolean not null default true, "restaurant_id" uuid not null, constraint "food_menu_pkey" primary key ("id"));`);

    this.addSql(`create table "menu_category_menus" ("menu_category_entity_id" int not null, "food_menu_entity_id" uuid not null, constraint "menu_category_menus_pkey" primary key ("menu_category_entity_id", "food_menu_entity_id"));`);

    this.addSql(`create table "post" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(255) null default '', "caption" varchar(255) not null, "location" point null, "user_id" uuid not null, constraint "post_pkey" primary key ("id"));`);

    this.addSql(`create table "user_liked_posts" ("user_entity_id" uuid not null, "post_entity_id" uuid not null, constraint "user_liked_posts_pkey" primary key ("user_entity_id", "post_entity_id"));`);

    this.addSql(`create table "post-media" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "url" varchar(255) not null, "type" varchar(255) not null, "extension" varchar(255) not null, "post_id" uuid not null, constraint "post-media_pkey" primary key ("id"));`);
    this.addSql(`create index "post-media_post_id_index" on "post-media" ("post_id");`);

    this.addSql(`create table "post_hashtag_post" ("post_hashtag_entity_id" uuid not null, "post_entity_id" uuid not null, constraint "post_hashtag_post_pkey" primary key ("post_hashtag_entity_id", "post_entity_id"));`);

    this.addSql(`create table "post_comment" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "text" varchar(255) not null, "post_id" uuid not null, "user_id" uuid not null, constraint "post_comment_pkey" primary key ("id"));`);

    this.addSql(`create table "user_liked_comments" ("user_entity_id" uuid not null, "post_comment_entity_id" uuid not null, constraint "user_liked_comments_pkey" primary key ("user_entity_id", "post_comment_entity_id"));`);

    this.addSql(`create table "livestream-room-like" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "room_name" varchar(255) not null, "user_id" uuid not null, constraint "livestream-room-like_pkey" primary key ("id"));`);

    this.addSql(`create table "livestream-room-comment" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "room_name" varchar(255) not null, "user_id" uuid not null, "text" varchar(255) not null, constraint "livestream-room-comment_pkey" primary key ("id"));`);

    this.addSql(`create table "customer" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "bio" text null default '', "wallet" int not null default 0, "user_id" uuid not null, constraint "customer_pkey" primary key ("id"));`);
    this.addSql(`alter table "customer" add constraint "customer_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant_theme_restaurants" add constraint "restaurant_theme_restaurants_restaurant_theme_entity_id_foreign" foreign key ("restaurant_theme_entity_id") references "restaurant_theme" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "restaurant_theme_restaurants" add constraint "restaurant_theme_restaurants_restaurant_entity_id_foreign" foreign key ("restaurant_entity_id") references "restaurant" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "food_menu" add constraint "food_menu_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "menu_category_menus" add constraint "menu_category_menus_menu_category_entity_id_foreign" foreign key ("menu_category_entity_id") references "menu_category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "menu_category_menus" add constraint "menu_category_menus_food_menu_entity_id_foreign" foreign key ("food_menu_entity_id") references "food_menu" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "post" add constraint "post_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "user_liked_posts" add constraint "user_liked_posts_user_entity_id_foreign" foreign key ("user_entity_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_liked_posts" add constraint "user_liked_posts_post_entity_id_foreign" foreign key ("post_entity_id") references "post" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "post-media" add constraint "post-media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "post_hashtag_post" add constraint "post_hashtag_post_post_hashtag_entity_id_foreign" foreign key ("post_hashtag_entity_id") references "post_hashtag" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "post_hashtag_post" add constraint "post_hashtag_post_post_entity_id_foreign" foreign key ("post_entity_id") references "post" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "post_comment" add constraint "post_comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_comment" add constraint "post_comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "user_liked_comments" add constraint "user_liked_comments_user_entity_id_foreign" foreign key ("user_entity_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_liked_comments" add constraint "user_liked_comments_post_comment_entity_id_foreign" foreign key ("post_comment_entity_id") references "post_comment" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "livestream-room-like" add constraint "livestream-room-like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "livestream-room-comment" add constraint "livestream-room-comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop table if exists "restaurant_menu" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "menu_category_menus" drop constraint "menu_category_menus_menu_category_entity_id_foreign";`);

    this.addSql(`alter table "post_hashtag_post" drop constraint "post_hashtag_post_post_hashtag_entity_id_foreign";`);

    this.addSql(`alter table "restaurant_theme_restaurants" drop constraint "restaurant_theme_restaurants_restaurant_theme_entity_id_foreign";`);

    this.addSql(`alter table "restaurant" drop constraint "restaurant_user_id_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_user_id_foreign";`);

    this.addSql(`alter table "user_liked_posts" drop constraint "user_liked_posts_user_entity_id_foreign";`);

    this.addSql(`alter table "post_comment" drop constraint "post_comment_user_id_foreign";`);

    this.addSql(`alter table "user_liked_comments" drop constraint "user_liked_comments_user_entity_id_foreign";`);

    this.addSql(`alter table "livestream-room-like" drop constraint "livestream-room-like_user_id_foreign";`);

    this.addSql(`alter table "livestream-room-comment" drop constraint "livestream-room-comment_user_id_foreign";`);

    this.addSql(`alter table "customer" drop constraint "customer_user_id_foreign";`);

    this.addSql(`alter table "restaurant_theme_restaurants" drop constraint "restaurant_theme_restaurants_restaurant_entity_id_foreign";`);

    this.addSql(`alter table "food_menu" drop constraint "food_menu_restaurant_id_foreign";`);

    this.addSql(`alter table "menu_category_menus" drop constraint "menu_category_menus_food_menu_entity_id_foreign";`);

    this.addSql(`alter table "user_liked_posts" drop constraint "user_liked_posts_post_entity_id_foreign";`);

    this.addSql(`alter table "post-media" drop constraint "post-media_post_id_foreign";`);

    this.addSql(`alter table "post_hashtag_post" drop constraint "post_hashtag_post_post_entity_id_foreign";`);

    this.addSql(`alter table "post_comment" drop constraint "post_comment_post_id_foreign";`);

    this.addSql(`alter table "user_liked_comments" drop constraint "user_liked_comments_post_comment_entity_id_foreign";`);

    this.addSql(`create table "restaurant_menu" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "name" varchar(255) not null, "price" int4 not null, "description" varchar(255) not null, "picture_url" varchar(255) not null, "estimated_time" int4 not null, "restaurant_id" uuid not null, "is_stock_available" bool not null default true, constraint "restaurant_menu_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "menu_category" cascade;`);

    this.addSql(`drop table if exists "post_hashtag" cascade;`);

    this.addSql(`drop table if exists "restaurant_theme" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "restaurant" cascade;`);

    this.addSql(`drop table if exists "restaurant_theme_restaurants" cascade;`);

    this.addSql(`drop table if exists "food_menu" cascade;`);

    this.addSql(`drop table if exists "menu_category_menus" cascade;`);

    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`drop table if exists "user_liked_posts" cascade;`);

    this.addSql(`drop table if exists "post-media" cascade;`);

    this.addSql(`drop table if exists "post_hashtag_post" cascade;`);

    this.addSql(`drop table if exists "post_comment" cascade;`);

    this.addSql(`drop table if exists "user_liked_comments" cascade;`);

    this.addSql(`drop table if exists "livestream-room-like" cascade;`);

    this.addSql(`drop table if exists "livestream-room-comment" cascade;`);

    this.addSql(`drop table if exists "customer" cascade;`);
  }

}
