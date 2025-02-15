import { PostHashtagEntity } from "../persistence/post-hashtag.entity";
import { PostHashtag } from "./post-hashtag";

export class PostHashtagMapper{
    static toDomain(raw: PostHashtagEntity): PostHashtag{
        const postHashtag = new PostHashtag()
        postHashtag.id = raw.id
        postHashtag.tag = raw.tag
        return postHashtag
    }
}