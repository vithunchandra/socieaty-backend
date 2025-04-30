import { Migration } from '@mikro-orm/migrations';

export class Migration20250430071133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" add column "is_account_verified" boolean not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop column "is_account_verified";`);
  }

}
