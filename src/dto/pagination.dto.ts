export class PaginationDto{
    count: number
    hasNext: boolean
    hasPrevious: boolean
    nextOffset: number
    previousOffset: number

    static createPaginationDto(count: number, limit: number, offset: number){
        const pagination = new PaginationDto()
        pagination.nextOffset = offset + limit
		pagination.previousOffset = offset - limit
		pagination.hasNext = pagination.nextOffset < count
		pagination.hasPrevious = pagination.previousOffset >= 0
		pagination.count = count
        return pagination
    }
}