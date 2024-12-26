import { Module } from '@nestjs/common';
import { AuthController } from './auth.api.controller';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from '../restaurant/restaurant.api.module';
import { UserDaoModule } from '../user/persistance/User.dao.module';
import { AuthService } from './auth.api.service';
import { CustomerModule } from '../customer/customer.api.module';
import { AuthGuardModule } from 'src/module/AuthGuard/AuthGuard.module';

@Module({
    imports: [
        CustomerModule,
        RestaurantModule,
        UserDaoModule,
        ConfigModule.forRoot(),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
