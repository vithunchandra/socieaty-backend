import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRoot({}),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule { }