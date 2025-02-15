import { BASE_URL } from "../../../constants";
import { PostMediaEntity } from "../persistence/post-media.entity";
import { PostMedia } from "./post-media";

export class PostMediaMapper{
    static toDomain(raw: PostMediaEntity): PostMedia {    
        const postMedia = new PostMedia()
        postMedia.url = `${BASE_URL}${raw.url.replaceAll('\\', '/')}`
        postMedia.type = raw.type
        postMedia.postId = raw.post.id
        postMedia.extension = raw.extension
        postMedia.videoThumbnailUrl = raw.videoThumbnailUrl ? `${BASE_URL}${raw.videoThumbnailUrl}` : undefined
        return postMedia
    }
}