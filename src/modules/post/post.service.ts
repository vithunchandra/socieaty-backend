import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PostDaoService } from './persistence/post.dao.service'
import { CreatePostRequestDto } from './dto/create-post-request.dto'
import { UserEntity, UserRole } from '../user/persistance/user.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { MediaDaoService } from '../post-media/persistence/post-media.dao.service'
import { PostMapper } from './domain/post.mapper'
import { PostHashtagDaoService } from '../post-hashtag/persistence/post-hashtag.dao.service'
import { Post } from './domain/post'
import { wrap } from 'module'
import { Point } from '../restaurant/persistence/custom-type/point-type'
import { GetPaginatedPostQueryRequestDto } from './dto/get-paginated-post-query.request.dto'
import { PaginationDirection } from '../../enums/pagination-direction.enum'
import { PaginationDto } from '../../dto/pagination.dto'
import Ffmpeg from 'fluent-ffmpeg'
import { generateVideoThumbnail } from '../../utils/image.utils'
import { UpdatePostRequestDto } from './dto/update-post-request.dto'
import { unlink } from 'fs'
import constants from '../../constants'

@Injectable()
export class PostService {
	constructor(
		private readonly postDaoService: PostDaoService,
		private readonly mediaDaoService: MediaDaoService,
		private readonly postHashtagDaoService: PostHashtagDaoService,
		private readonly em: EntityManager
	) {}

	async createPost(user: UserEntity, data: CreatePostRequestDto, medias: Express.Multer.File[]) {
		let location: Point | undefined = undefined
		if (data.location?.latitude === 0 && data.location?.longitude === 0) {
			location = undefined
		} else {
			location = data.location
		}
		const post = this.postDaoService.createPost({
			user: user.id,
			title: data.title,
			caption: data.caption,
			location: location
		})
		const postMedias = this.mediaDaoService.createMedia(
			await Promise.all(
				medias.map(async (media) => {
					const extension = media.originalname.substring(
						media.originalname.lastIndexOf('.') + 1
					)
					let type = 'image'
					if (extension.match(/(mp4|webm|ogg|mp3|wav|flac|aac)$/i)) {
						type = 'video'
					}
					let videoThumbnailUrl: string | undefined = undefined
					if (type === 'video') {
						videoThumbnailUrl = await generateVideoThumbnail(
							media.path,
							media.originalname
						)
					}
					return {
						url: `${constants().POST_MEDIA_RELATIVE_URL}/${type}s/${media.filename}`,
						type: type,
						post: post.id,
						extension: extension,
						videoThumbnailUrl: videoThumbnailUrl
					}
				})
			)
		)
		const postHashTags = await this.postHashtagDaoService.createPostHastag({
			tags: data.hashtags
		})
		post.hashtags.add(postHashTags)
		await this.em.flush()

		const postInstance = await this.postDaoService.findOneById(post.id)
		const postDomain = PostMapper.toDomain(postInstance)
		return { post: postDomain }
	}

	async updatePost(postId: string, data: UpdatePostRequestDto, medias: Express.Multer.File[]) {
		const post = await this.postDaoService.findOneById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		let location: Point | undefined = undefined
		const filteredDeleteMedias = data.deleteMediaIds.filter((id) => id.trim() !== '')
		for (const media of post.medias) {
			if (filteredDeleteMedias.includes(media.id)) {
				if (media) {
					if (!media.url.includes('dummy')) {
						unlink(`src/${media.url}`, (err) => {
							console.log(err)
						})
					}
					if (media.type === 'video' && !media.videoThumbnailUrl?.includes('dummy')) {
						unlink(`src/${media.videoThumbnailUrl}`, (err) => {
							console.log(err)
						})
					}
				}
			}
		}
		if (filteredDeleteMedias.length > 0) {
			await this.mediaDaoService.deleteMedia(filteredDeleteMedias)
		}
		const postMedias = this.mediaDaoService.createMedia(
			await Promise.all(
				medias.map(async (media) => {
					const extension = media.originalname.substring(
						media.originalname.lastIndexOf('.') + 1
					)
					let type = 'image'
					if (extension.match(/(mp4|webm|ogg|mp3|wav|flac|aac)$/i)) {
						type = 'video'
					}
					let videoThumbnailUrl: string | undefined = undefined
					if (type === 'video') {
						videoThumbnailUrl = await generateVideoThumbnail(
							media.path,
							media.originalname
						)
					}
					return {
						url: `${constants().POST_MEDIA_RELATIVE_URL}/${type}s/${media.filename}`,
						type: type,
						post: post.id,
						extension: extension,
						videoThumbnailUrl: videoThumbnailUrl
					}
				})
			)
		)
		if (data.location?.latitude === 0 && data.location?.longitude === 0) {
			location = undefined
		} else {
			location = data.location
		}
		post.hashtags.removeAll()
		const postHashTags = await this.postHashtagDaoService.createPostHastag({
			tags: data.hashtags
		})
		post.hashtags.add(postHashTags)
		post.title = data.title
		post.caption = data.caption
		post.location = location
		await this.em.flush()

		const updatedPost = await this.postDaoService.findOneById(postId)
		const updatedPostDomain = PostMapper.toDomain(updatedPost)
		return { post: updatedPostDomain }
	}

	async likePost(postId: string, userId: string, isLiked: boolean) {
		const post = await this.postDaoService.findOneById(postId)
		const user = await this.em.getRepository(UserEntity).findOne({ id: userId })
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		if (!user) {
			throw new NotFoundException('User not found')
		}
		const alreadyLiked = await this.postDaoService.isLiked(userId, postId)
		let result = isLiked
		if (alreadyLiked !== isLiked) {
			result = this.postDaoService.likePost({ post, user })
		}
		await this.em.flush()
		const refreshedPost = await this.postDaoService.findOneById(postId)
		return {
			updatedPost: PostMapper.toDomain(refreshedPost!),
			isLiked: result,
			likes: refreshedPost!.postLikes.length
		}
	}

	async getAllPosts() {
		const posts = await this.postDaoService.findAll()
		return {
			posts: posts.map((post) => PostMapper.toDomain(post)).filter((post) => post !== null)
		}
	}

	async getPaginatedPosts(query: GetPaginatedPostQueryRequestDto) {
		const { items, count } = await this.postDaoService.paginatePosts(query)
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)
		return {
			posts: items.map((post) => PostMapper.toDomain(post)).filter((post) => post !== null),
			pagination: pagination
		}
	}

	async getPostById(postId: string) {
		const post = await this.postDaoService.findOneById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		return {
			post: PostMapper.toDomain(post)
		}
	}

	async getPostLikes(post_id: string) {
		const posts = await this.postDaoService.findOneById(post_id)
		return {
			likes: PostMapper.ToPostLikesDomain(posts)
		}
	}

	async deletePost(postId: string, user: UserEntity) {
		const post = await this.postDaoService.findOneById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}

		if (user.role !== UserRole.ADMIN && user.id !== post.user.id) {
			throw new BadRequestException('You are not allowed to delete this post')
		}

		post.deletedAt = new Date()
		await this.em.flush()
		return {
			message: 'Post deleted successfully'
		}
	}
}
