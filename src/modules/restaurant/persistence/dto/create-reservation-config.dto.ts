export class CreateReservationConfigDto {
    restaurantId: string
    maxPerson: number
    minCostPerPerson: number
    timeLimit: number
    facilities: string[]
}