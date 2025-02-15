import { Migration } from '@mikro-orm/migrations';

export class Migration20250214055503 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post-media" add column "video_thumbnail_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post-media" drop column "video_thumbnail_url";`);
  }

}
