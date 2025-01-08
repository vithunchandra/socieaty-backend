import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OptionalProps, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { Point, PointType } from "../../restaurant/persistence/custom-type/PointType";
import { PostCommentEntity } from "../../post-comment/persistence/post-comment.entity";
import { UserEntity } from "../../user/persistance/User.entity";
import { PostMediaEntity } from "../../post-media/persistence/post-media.entity";
import { PostHashtagEntity } from "../../post-hashtag/persistence/post-hashtag.entity";

@Entity({tableName: "post"})
export class PostEntity extends BaseEntity<'location'>{
    @Property({nullable: true, default: ""})
    title: string

    @Property({nullable: false})
    caption: string

    @Property({type: PointType, nullable: true})
    location?: Point

    @OneToMany({
        entity: () => PostMediaEntity,
        mappedBy: 'post',
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
        orphanRemoval: true 
    })
    medias = new Collection<PostMediaEntity>(this);

    @OneToMany({
        entity: () => PostCommentEntity,
        mappedBy: 'post',
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
        orphanRemoval: true,
    })
    comments = new Collection<PostCommentEntity>(this)

    @ManyToMany({
        entity: () => UserEntity,
        mappedBy: 'likedPosts',
    })
    postLikes = new Collection<UserEntity>(this)

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'posts',
        fieldName: 'user_id', 
    })
    user: UserEntity

    @ManyToMany({
        entity: () => PostHashtagEntity,
        mappedBy: 'post',
    })
    hashtags = new Collection<PostHashtagEntity>(this)

    constructor(user: UserEntity, title: string, caption: string, location?: Point){
        super()
        this.user = user
        this.title = title
        this.caption = caption
        this.location = location
    }
}