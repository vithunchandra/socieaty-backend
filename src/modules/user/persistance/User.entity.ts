import { Collection, Entity, Enum, HiddenProps, OneToMany, OneToOne, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { BaseEntity } from '../../../database/model/base/Base.entity';
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity';
import { CustomerEntity } from '../../customer/persistence/Customer.entity';
import { PostEntity } from '../../post/persistence/post.entity';
import { PostCommentEntity } from '../../post-comment/persistence/post-comment.entity';
import { PostLikeEntity } from '../../post-likes/persistence/post-like.entity';

@Entity({tableName: "user"})
export class UserEntity extends BaseEntity{
   @Property({nullable: false, type: 'varchar(128)'})
   name!: string

   @Property({nullable: false, unique: true, type:'varchar(128)'})
   email!: string

   @Property({nullable: false, type:'varchar(128)'})
   password!: string

   @Property({nullable: false})
   phoneNumber: string

   @Enum(() => UserRole)
   role: UserRole

   @OneToOne({
      entity: () => RestaurantEntity,
      mappedBy: (restaurant) => restaurant.userData,
      nullable: true,
   })
   restaurantData: RestaurantEntity | null = null

   @OneToOne({
      entity: () => CustomerEntity,
      mappedBy: (customer) => customer.userData,
      nullable: true,
   })
   customerData: CustomerEntity | null = null

   @OneToMany({
      entity: () => PostEntity,
      mappedBy: 'user',
      orphanRemoval: true
   })
   posts = new Collection<PostEntity>(this)

   @OneToMany({
      entity: () => PostCommentEntity, 
      mappedBy: 'user',
      orphanRemoval: true,
   })
   comments = new Collection<PostCommentEntity>(this)

   @OneToMany({
      entity: () => PostLikeEntity,
      mappedBy: 'user',
      orphanRemoval: true,
   })
   likes = new Collection<PostLikeEntity>(this)

   constructor(name: string, email: string, password: string, phoneNumber: string, role: UserRole){
      super();
      this.name = name
      this.email = email
      this.password = password
      this.phoneNumber = phoneNumber
      this.role = role
   }
}

export enum UserRole{
   ADMIN = "Admin",
   CUSTOMER = "Customer",
   RESTAURANT = "Restaurant"
}