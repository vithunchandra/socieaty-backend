import { BadRequestException } from '@nestjs/common'
import { Request } from 'express'
import { POST_MEDIA_UPLOADS_DIR } from '../constants'
import * as Ffmpeg from 'fluent-ffmpeg'

const fileNameEditor = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, name: string) => void
) => {
	const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
	const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'))
	let newFileName = ''
	newFileName = `${fileName}_${Date.now()}.${extension}`
	callback(null, newFileName)
}

const imageFileFilter = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, valid: boolean) => void
) => {
	if (!file.originalname) {
		return callback(new BadRequestException('Media must exist'), false)
	}
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		return callback(new BadRequestException('File must be of type jpg|jpeg|png'), false)
	}
	return callback(null, true)
}

const mediaFileFilter = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, valid: boolean) => void
) => {
	if (!file.originalname) {
		return callback(new BadRequestException('Media must exist'), false)
	}
	if (!file.originalname.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac|jpg|jpeg|png|gif|svg|webp)$/)) {
		return callback(
			new BadRequestException('File must be of type mp4|webm|ogg|mp3|wav|flac|aac'),
			false
		)
	}
	return callback(null, true)
}

const fileDestination = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: (error: Error | null, destination: string) => void
) => {
	const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
	if (extension.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i)) {
		callback(null, `${POST_MEDIA_UPLOADS_DIR}/videos`)
	} else {
		callback(null, `${POST_MEDIA_UPLOADS_DIR}/images`)
	}
}

async function generateVideoThumbnail(videoPath: string, filename: string) {
	return new Promise<string>((resolve, reject) => {
		const videoThumbnailFilename = `thumbnail_${filename.split('.')[0]}.jpg`
		Ffmpeg(videoPath)
			.screenshots({
				count: 1,
				timestamps: [0], // Capture a thumbnail at 1 second into the video
				filename: `thumbnail_${videoThumbnailFilename}.jpg`, // Generate a unique filename
				folder: `${POST_MEDIA_UPLOADS_DIR}/thumbnails`
			})
			.on('end', () => {
				resolve(`${POST_MEDIA_UPLOADS_DIR}/thumbnails/thumbnail_${videoThumbnailFilename}.jpg`)
			})
			.on('error', (err) => {
				reject(new BadRequestException('Error generating thumbnail'))
			})
	})
}

export { fileNameEditor, imageFileFilter, mediaFileFilter, fileDestination, generateVideoThumbnail }
