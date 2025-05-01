import { Migration } from '@mikro-orm/migrations';

export class Migration20250501134842 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" rename column "is_account_verified" to "verification_status";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" rename column "verification_status" to "is_account_verified";`);
  }

}
