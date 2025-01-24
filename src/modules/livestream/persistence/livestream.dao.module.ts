import { Module } from "@nestjs/common";
import { LivestreamDaoService } from "./livestream.dao.service";

@Module({
    controllers: [],
    providers: [LivestreamDaoService],
    exports: [LivestreamDaoService]
})
export class LivestreamDaoModule{}