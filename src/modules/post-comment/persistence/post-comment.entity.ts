import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { PostEntity } from "../../post/persistence/post.entity";
import { UserEntity } from "../../user/persistance/User.entity";

@Entity({tableName: "post_comment"})
export class PostCommentEntity extends BaseEntity{
    @Property()
    text: string
    
    @Property({default: 0})
    likes?: number

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

    constructor(post: PostEntity, user: UserEntity, text: string){
        super()
        this.user = user
        this.post = post
        this.text = text
    }
}