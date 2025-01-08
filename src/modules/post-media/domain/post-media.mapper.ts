import { PostMediaEntity } from "../persistence/post-media.entity";
import { PostMedia } from "./post-media";

export class PostMediaMapper{
    static toDomain(raw: PostMediaEntity): PostMedia {    
        const postMedia = new PostMedia()
        postMedia.url = raw.url
        postMedia.type = raw.type
        postMedia.postId = raw.post.id
        return postMedia
    }
}