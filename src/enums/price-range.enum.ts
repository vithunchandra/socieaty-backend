class PriceRangeCondition {
    constructor(
        public id: number,
        public minPrice: number,
        public maxPrice: number
    ) {}
}

export const PriceRange = {
    CONDITION_1: new PriceRangeCondition(1, 0, 9999),
    CONDITION_2: new PriceRangeCondition(2, 10000, 24999),
    CONDITION_3: new PriceRangeCondition(3, 25000, 49999),
    CONDITION_4: new PriceRangeCondition(4, 50000, 99999),
    CONDITION_5: new PriceRangeCondition(5, 100000, 9999999)
} as const;

export type PriceRangeType = typeof PriceRange[keyof typeof PriceRange];
