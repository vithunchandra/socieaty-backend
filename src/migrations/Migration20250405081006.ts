import { Migration } from '@mikro-orm/migrations';

export class Migration20250405081006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "topups" drop constraint if exists "topups_status_check";`);

    this.addSql(`alter table "topups" add constraint "topups_status_check" check("status" in ('pending', 'success', 'failed', 'expired'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "topups" drop constraint if exists "topups_status_check";`);

    this.addSql(`alter table "topups" add constraint "topups_status_check" check("status" in ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED'));`);
  }

}
