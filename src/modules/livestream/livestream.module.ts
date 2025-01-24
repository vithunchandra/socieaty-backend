import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LiveStreamController } from './livestream.controller'
import { LiveStreamService } from './livestream.service'
import { UserDaoModule } from '../user/persistance/User.dao.module'
import { LivestreamRepository } from './livestream.repository'
import { LivestreamDaoModule } from './persistence/livestream.dao.module'
import { RawBodyMiddleware } from '../../module/RawBodyMiddleware/raw-body-middleware'

@Module({
	imports: [UserDaoModule, LivestreamDaoModule],
	controllers: [LiveStreamController],
	providers: [LiveStreamService, LivestreamRepository],
	exports: [LiveStreamService]
})
export class LiveStreamModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RawBodyMiddleware)
		.forRoutes('/livestream/webhook-endpoint')
	}
}
