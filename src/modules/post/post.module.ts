import { Module } from '@nestjs/common'
import { PostDaoModule } from './persistence/post.dao.module'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { MediaDaoModule } from '../post-media/persistence/post-media.dao.module'
import { ConfigModule } from '@nestjs/config'
import { AuthGuardModule } from 'src/module/AuthGuard/AuthGuard.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'
import { PostHashtagDaoModule } from '../post-hashtag/persistence/post-hashtag.dao.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		PostDaoModule,
		MediaDaoModule,
		PostHashtagDaoModule,
		AuthGuardModule,
		UserDaoModule
	],
	controllers: [PostController],
	providers: [PostService]
})
export class PostModule {}
