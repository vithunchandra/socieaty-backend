export class PaginationDto {
	count: number
	hasNext: boolean
	hasPrevious: boolean
	nextPage: number
	previousPage: number

	static createPaginationDto(count: number, pageSize: number, page: number) {
		const pagination = new PaginationDto()
		pagination.nextPage = page + 1
		pagination.previousPage = page - 1
		pagination.hasNext = pagination.nextPage * pageSize < count
		pagination.hasPrevious = pagination.previousPage * pageSize >= 0
		pagination.count = count
		return pagination
	}
}
