import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Query,
	Request,
	UseGuards
} from '@nestjs/common'
import { LiveStreamService } from './livestream.service'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { StartLivestreamRequestDto } from './dto/start-livestream-request.dto'
import { CommentLivestreamRequestDto } from './dto/comment-livestream-request.dto'
import { LikeLivestreamRequestDto } from './dto/like-livestream-request.dto'
import { WebhookReceiver } from 'livekit-server-sdk'
import { Request as ExpressRequest } from 'express'
import { RawBodyMiddleware } from '../../module/RawBodyMiddleware/raw-body-middleware'
import { GetAllLivestreamsRequestQueryDto } from './dto/get-all-livestream-request-query.dto'

@Controller('livestream')
export class LiveStreamController {
	private readonly webhookReceiver: WebhookReceiver

	constructor(private readonly liveStreamService: LiveStreamService) {
		this.webhookReceiver = new WebhookReceiver(
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!
		)
	}

	@Post('start')
	@UseGuards(AuthGuard)
	async startLivestream(
		@Request() req: GuardedRequestDto,
		@Body() body: StartLivestreamRequestDto
	) {
		console.log(req.user)
		return this.liveStreamService.startLivestream(req.user, body.roomTitle)
	}

	@Post(':roomname/join')
	@UseGuards(AuthGuard)
	async joinLivestream(
		@Request() req: GuardedRequestDto,
		@Param('roomname') roomName: string
	) {
		return this.liveStreamService.joinLivestream(req.user, roomName)
	}

	@Get('')
	@UseGuards(AuthGuard)
	async getAllLivestreams(@Request() req: GuardedRequestDto, @Query() query: GetAllLivestreamsRequestQueryDto) {
		return this.liveStreamService.getAllLivestreams(query, req.user)
	}

	@Get('create-token')
	async createToken(@Body() data: any) {
		return this.liveStreamService.createAuthToken(data.identity)
	}

	@Post(':roomname/comment')
	@UseGuards(AuthGuard)
	async sendComment(
		@Request() req: GuardedRequestDto,
		@Param('roomname') roomName: string,
		@Body() data: CommentLivestreamRequestDto
	) {
		return this.liveStreamService.sendComment(req.user, roomName, data.text)
	}

	@Get(':roomname/comment')
	@UseGuards(AuthGuard)
	async getAllLivestreamComments(@Param('roomname') roomName: string) {
		return this.liveStreamService.getLivestreamComments(roomName)
	}

	@Post(':roomname/like')
	@UseGuards(AuthGuard)
	async sendLike(
		@Request() req: GuardedRequestDto,
		@Param('roomname') roomName: string,
		@Body() data: LikeLivestreamRequestDto
	) {
		return this.liveStreamService.sendLike(req.user, roomName, data.isLiked)
	}

	@Get(':roomname/like')
	@UseGuards(AuthGuard)
	async getAllLivestreamLikes(@Param('roomname') roomName: string) {
		return this.liveStreamService.getLivestreamLikes(roomName)
	}

	@Delete(':roomname')
	@UseGuards(AuthGuard)
	async deleteRoom(
		@Request() req: GuardedRequestDto,
		@Param('roomname') roomName: string
	) {
		return this.liveStreamService.deleteRoom(roomName, req.user)
	}

	@Post('/webhook-endpoint')
	async receiveWebhook(
		@Request() req: Request,
		@Headers('Authorization') authHeader: string
	) {
		try {
			if (!req['rawBody']) {
				throw new Error('Raw body is missing')
			}
			const event = await this.webhookReceiver.receive(
				req['rawBody'],
				authHeader
			)

			await this.liveStreamService.handleWebhook(event)
		} catch (error) {
			console.error('Error processing webhook:', error)
			throw new BadRequestException('Bad request')
		}
	}
}
