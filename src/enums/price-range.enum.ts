class PriceRangeCondition {
    constructor(
        public id: number,
        public minPrice: number,
        public maxPrice: number
    ) {}
}

export const PriceRange = {
    CONDITION_1: new PriceRangeCondition(1, 0, 10000),
    CONDITION_2: new PriceRangeCondition(2, 10000, 25000),
    CONDITION_3: new PriceRangeCondition(3, 25000, 75000),
    CONDITION_4: new PriceRangeCondition(4, 75000, 150000),
    CONDITION_5: new PriceRangeCondition(5, 150000, 9999999)
} as const;

export type PriceRangeType = typeof PriceRange[keyof typeof PriceRange];
