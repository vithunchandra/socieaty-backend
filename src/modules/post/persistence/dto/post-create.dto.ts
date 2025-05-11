import { Point } from 'src/modules/restaurant/persistence/custom-type/point-type'
import { UserEntity } from 'src/modules/user/persistance/user.entity'

export class PostCreateDto {
	title: string
	caption: string
	location?: Point
	user: string
}
