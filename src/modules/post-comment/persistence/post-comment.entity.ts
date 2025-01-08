import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { PostEntity } from "../../post/persistence/post.entity";
import { UserEntity } from "../../user/persistance/User.entity";

@Entity({tableName: "post_comment"})
export class PostCommentEntity extends BaseEntity{
    @Property()
    text: string

    @ManyToOne({
        entity: () => PostEntity,
        inversedBy: 'comments',
        fieldName: 'post_id'
    })
    post: PostEntity

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'comments',
        fieldName: 'user_id',
    })
    user: UserEntity

    @ManyToMany({
        entity: () => UserEntity,
        mappedBy: 'likedComments'
    })
    commentLikes = new Collection<UserEntity>(this)

    constructor(post: PostEntity, user: UserEntity, text: string){
        super()
        this.user = user
        this.post = post
        this.text = text
    }
}