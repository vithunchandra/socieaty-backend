import { Collection, Entity, Index, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { PostEntity } from "../../post/persistence/post.entity";
import { UserEntity } from "../../user/persistance/user.entity";

@Entity({tableName: "post_comment"})
export class PostCommentEntity extends BaseEntity{
    @Property({type: 'text'})
    text: string

    @ManyToOne({
        entity: () => PostEntity,
        inversedBy: 'comments',
        fieldName: 'post_id',
        index: true
    })
    post: PostEntity

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'comments',
        fieldName: 'user_id',
        index: true
    })
    user: UserEntity

    @ManyToMany({
        entity: () => UserEntity,
        mappedBy: 'likedComments',
        index: true
    })
    commentLikes = new Collection<UserEntity>(this)

    constructor(post: PostEntity, user: UserEntity, text: string){
        super()
        this.user = user
        this.post = post
        this.text = text
    }
}