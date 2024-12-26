import { Module } from '@nestjs/common';
import { AuthGuard } from './AuthGuard.service';
import { UserDaoModule } from 'src/modules/user/persistance/User.dao.module';

@Module({
    imports: [UserDaoModule],
    providers: [AuthGuard],
    exports: [AuthGuard]
})
export class AuthGuardModule {}