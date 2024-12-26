import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../../database/model/base/Base.entity';
import { PostEntity } from '../../post/persistence/post.entity';
import { UserEntity } from '../../user/persistance/User.entity';

@Entity({tableName: 'post-like'})
export class PostLikeEntity extends BaseEntity {
    @ManyToOne({
        entity: () => PostEntity,
        inversedBy: 'likes',
        fieldName: 'post_id'
    })
    post: PostEntity;

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'likes',
        fieldName: 'user_id',
    })
    user: UserEntity;

    constructor(post: PostEntity, user: UserEntity) {
        super();
        this.post = post;
        this.user = user;
    }
}