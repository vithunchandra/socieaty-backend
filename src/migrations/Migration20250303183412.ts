import { Migration } from '@mikro-orm/migrations';

export class Migration20250303183412 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transactions" drop constraint if exists "transactions_status_check";`);

    this.addSql(`alter table "transactions" add constraint "transactions_status_check" check("status" in ('pending', 'rejected', 'preparing', 'ready', 'completed'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transactions" drop constraint if exists "transactions_status_check";`);

    this.addSql(`alter table "transactions" add constraint "transactions_status_check" check("status" in ('confirming', 'pending', 'process', 'completed', 'cancelled'));`);
  }

}
