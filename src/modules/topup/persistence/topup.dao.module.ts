import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TopupEntity } from "./topup.entity";
import { TopupDaoService } from "./topup.dao.service";

@Module({
    imports: [
        MikroOrmModule.forFeature([TopupEntity])
    ],
    providers: [TopupDaoService],
    exports: [TopupDaoService]
})
export class TopupDaoModule {}