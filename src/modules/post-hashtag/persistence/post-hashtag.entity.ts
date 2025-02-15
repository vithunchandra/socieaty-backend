import { Collection, Entity, ManyToMany, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { PostEntity } from "../../post/persistence/post.entity";

@Entity({tableName: 'post_hashtag'})
export class PostHashtagEntity extends BaseEntity{
    @Property()
    @Unique()
    tag: string

    @ManyToMany({entity: () => PostEntity, inversedBy: 'hashtags'})
    post = new Collection<PostEntity>(this)

    constructor(tag: string) {
        super()
        this.tag = tag
    }
}