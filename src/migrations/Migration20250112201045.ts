import { Migration } from '@mikro-orm/migrations';

export class Migration20250112201045 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post-media" add column "extension" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post-media" drop column "extension";`);
  }

}
