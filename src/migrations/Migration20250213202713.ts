import { Migration } from '@mikro-orm/migrations';

export class Migration20250213202713 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create index "post_user_id_index" on "post" ("user_id");`);

    this.addSql(`create index "post_comment_post_id_index" on "post_comment" ("post_id");`);
    this.addSql(`create index "post_comment_user_id_index" on "post_comment" ("user_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "post_user_id_index";`);

    this.addSql(`drop index "post_comment_post_id_index";`);
    this.addSql(`drop index "post_comment_user_id_index";`);
  }

}
