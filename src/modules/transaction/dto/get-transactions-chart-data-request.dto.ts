import { Transform } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { fieldToDate, fieldToString, fieldToTimeScale } from "../../../utils/request_field_transformer.util"
import { TimeScale } from "../../../enums/time-scale.enum"

class GetTransactionsChartDataRequestDto {
    @IsOptional()
	@Transform((data) => fieldToDate(data))
    rangeStartDate?: Date

    @IsOptional()
	@Transform((data) => fieldToDate(data))
    rangeEndDate?: Date

    @IsString()
	@IsOptional()
	@Transform((data) => fieldToString(data))
    restaurantId: string

    @IsString()
	@Transform((data) => fieldToTimeScale(data))
    timeScale: TimeScale
}
