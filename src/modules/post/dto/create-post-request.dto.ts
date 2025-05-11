import { Type } from 'class-transformer'
import {
	IsArray,
	IsNotEmpty,
	IsNotEmptyObject,
	isNotEmptyObject,
	IsObject,
	IsOptional,
	IsString,
	Validate,
	ValidateNested
} from 'class-validator'
import { Point } from 'src/modules/restaurant/persistence/custom-type/point-type'

export class CreatePostRequestDto {
	@IsNotEmpty()
	@IsString()
	title: string

	@IsNotEmpty()
	@IsString()
	caption: string

	@IsObject()
	@Type(() => Point)
	@ValidateNested()
	location: Point

	@IsArray()
	@IsString({ each: true })
	hashtags: string[]
}
