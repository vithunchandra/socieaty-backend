import { Post } from "../../post/domain/post";
import { User } from "./User";

class UserProfile{
    user: User
    posts: Post[]
    viewers: number
    likes: number
}