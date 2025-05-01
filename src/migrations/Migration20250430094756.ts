import { Migration } from '@mikro-orm/migrations';

export class Migration20250430094756 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" alter column "is_account_verified" type text using ("is_account_verified"::text);`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_is_account_verified_check" check("is_account_verified" in ('unverified', 'verified', 'rejected'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint if exists "restaurant_is_account_verified_check";`);

    this.addSql(`alter table "restaurant" alter column "is_account_verified" type boolean using ("is_account_verified"::boolean);`);
  }

}
