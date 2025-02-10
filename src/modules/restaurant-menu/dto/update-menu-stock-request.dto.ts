import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateMenuStockRequestDto {
	@IsBoolean()
	@IsNotEmpty()
    isAvailable: boolean
}