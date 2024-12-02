import { Module } from '@nestjs/common';
import { AuthController } from './auth.api.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from 'src/module/AuthGuard/AuthGuard';
import { CustomerDaoModule } from 'src/modules/customer/persistence/Customer.dao.module';
import { RestaurantModule } from '../restaurant/restaurant.api.module';
import { UserDaoModule } from '../user/persistance/User.dao.module';
import { AuthService } from './auth.api.service';

@Module({
    imports: [
        CustomerDaoModule,
        RestaurantModule,
        UserDaoModule,
        ConfigModule.forRoot()
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard]
})
export class AuthModule {}
