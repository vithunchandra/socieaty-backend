import { Cascade, Collection, Entity, ManyToOne, OneToMany, OptionalProps, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { Point, PointType } from "../../restaurant/persistence/custom-type/PointType";
import { PostCommentEntity } from "../../post-comment/persistence/post-comment.entity";
import { PostLikeEntity } from "../../post-likes/persistence/post-like.entity";
import { UserEntity } from "../../user/persistance/User.entity";
import { PostMediaEntity } from "../../post-media/persistence/media.entity";

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

    @OneToMany({
        entity: () => PostLikeEntity,
        mappedBy: 'post',
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
        orphanRemoval: true
    })
    likes = new Collection<PostLikeEntity>(this)

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'posts',
        fieldName: 'user_id', 
    })
    user: UserEntity

    constructor(user: UserEntity, title: string, caption: string, location?: Point){
        super()
        this.user = user
        this.title = title
        this.caption = caption
        this.location = location
    }
}