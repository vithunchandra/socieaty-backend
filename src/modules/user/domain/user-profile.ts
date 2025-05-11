import { Post } from "../../post/domain/post";
import { User } from "./user";

class UserProfile{
    user: User
    posts: Post[]
    viewers: number
    likes: number
}