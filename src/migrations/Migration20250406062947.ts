import { Migration } from '@mikro-orm/migrations';

export class Migration20250406062947 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "topups" add column "snap_token" varchar(255) null, add column "redirect_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "topups" drop column "snap_token", drop column "redirect_url";`);
  }

}
