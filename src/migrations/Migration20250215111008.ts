import { Migration } from '@mikro-orm/migrations';

export class Migration20250215111008 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post" alter column "caption" type text using ("caption"::text);`);

    this.addSql(`alter table "post_comment" alter column "text" type text using ("text"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post" alter column "caption" type varchar(255) using ("caption"::varchar(255));`);

    this.addSql(`alter table "post_comment" alter column "text" type varchar(255) using ("text"::varchar(255));`);
  }

}
