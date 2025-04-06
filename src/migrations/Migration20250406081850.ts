import { Migration } from '@mikro-orm/migrations';

export class Migration20250406081850 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "topups" rename column "redirect_url" to "snap_redirect_url";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "topups" rename column "snap_redirect_url" to "redirect_url";`);
  }

}
