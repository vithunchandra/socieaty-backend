import { Migration } from '@mikro-orm/migrations';

export class Migration20250210111631 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant_menu" add column "is_stock_available" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant_menu" drop column "is_stock_available";`);
  }

}
