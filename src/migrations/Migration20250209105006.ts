import { Migration } from '@mikro-orm/migrations';

export class Migration20250209105006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "restaurant" add column "open_time" varchar(255) not null, add column "close_time" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop column "open_time", drop column "close_time";`);
  }

}
