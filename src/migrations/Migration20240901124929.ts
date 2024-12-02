import { Migration } from '@mikro-orm/migrations';

export class Migration20240901124929 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_restaurant_data_id_foreign";');
    this.addSql('alter table "user" drop constraint "user_customer_data_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_restaurant_data_id_unique";');
    this.addSql('alter table "user" drop constraint "user_customer_data_id_unique";');
    this.addSql('alter table "user" drop column "restaurant_data_id", drop column "customer_data_id";');

    this.addSql('alter table "restaurant" add column "user_id" uuid not null;');
    this.addSql('alter table "restaurant" add constraint "restaurant_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "restaurant" add constraint "restaurant_user_id_unique" unique ("user_id");');

    this.addSql('alter table "customer" add column "user_id" uuid not null;');
    this.addSql('alter table "customer" add constraint "customer_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "customer" add constraint "customer_user_id_unique" unique ("user_id");');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "customer" drop constraint "customer_user_id_foreign";');

    this.addSql('alter table "restaurant" drop constraint "restaurant_user_id_foreign";');

    this.addSql('alter table "customer" drop constraint "customer_user_id_unique";');
    this.addSql('alter table "customer" drop column "user_id";');

    this.addSql('alter table "restaurant" drop constraint "restaurant_user_id_unique";');
    this.addSql('alter table "restaurant" drop column "user_id";');

    this.addSql('alter table "user" add column "restaurant_data_id" uuid null, add column "customer_data_id" uuid null;');
    this.addSql('alter table "user" add constraint "user_restaurant_data_id_foreign" foreign key ("restaurant_data_id") references "restaurant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_customer_data_id_foreign" foreign key ("customer_data_id") references "customer" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_restaurant_data_id_unique" unique ("restaurant_data_id");');
    this.addSql('alter table "user" add constraint "user_customer_data_id_unique" unique ("customer_data_id");');
  }

}
