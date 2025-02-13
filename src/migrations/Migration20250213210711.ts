import { Migration } from '@mikro-orm/migrations';

export class Migration20250213210711 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index "post_hashtag_id_index";`);

    this.addSql(`drop index "user_id_index";`);

    this.addSql(`drop index "restaurant_id_index";`);

    this.addSql(`drop index "food_menu_id_index";`);

    this.addSql(`drop index "post_id_index";`);

    this.addSql(`drop index "post-media_id_index";`);

    this.addSql(`drop index "post_comment_id_index";`);

    this.addSql(`drop index "livestream-room-like_id_index";`);

    this.addSql(`drop index "livestream-room-comment_id_index";`);

    this.addSql(`drop index "customer_id_index";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create index "post_hashtag_id_index" on "post_hashtag" ("id");`);

    this.addSql(`create index "user_id_index" on "user" ("id");`);

    this.addSql(`create index "restaurant_id_index" on "restaurant" ("id");`);

    this.addSql(`create index "food_menu_id_index" on "food_menu" ("id");`);

    this.addSql(`create index "post_id_index" on "post" ("id");`);

    this.addSql(`create index "post-media_id_index" on "post-media" ("id");`);

    this.addSql(`create index "post_comment_id_index" on "post_comment" ("id");`);

    this.addSql(`create index "livestream-room-like_id_index" on "livestream-room-like" ("id");`);

    this.addSql(`create index "livestream-room-comment_id_index" on "livestream-room-comment" ("id");`);

    this.addSql(`create index "customer_id_index" on "customer" ("id");`);
  }

}
