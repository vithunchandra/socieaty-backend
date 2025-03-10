import { Migration } from '@mikro-orm/migrations';

export class Migration20250302133502 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transactions" add column "note" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transactions" drop column "note";`);
  }

}
