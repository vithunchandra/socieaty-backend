import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MenuItemEntity } from "./menu-item.entity";
import { MenuItemDaoService } from "./menu-item.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([MenuItemEntity])],
    providers: [MenuItemDaoService],
    exports: [MenuItemDaoService]
})
export class MenuItemDaoModule {}