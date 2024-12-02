import { Migration } from '@mikro-orm/migrations';

export class Migration20240831131358 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "user" add column "role" text check ("role" in (\'Admin\', \'Customer\', \'Restaurant\')) not null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "user" drop column "role";');
  }

}
