import { createContext, useContext } from "react";

export type CategoryImageMapper = {
    'Transportation': string;
    'Food': string;
    'Housing': string;
    'Personal Spending': string;
}

const CategoryImageContext = createContext<CategoryImageMapper>({
    'Transportation': require('../assets/images/transportationCategory.svg').default,
    'Food': require('../assets/images/foodCategory.svg').default,
    'Housing': require('../assets/images/houseCategory.svg').default,
    'Personal Spending': require('../assets/images/beerCategory.svg').default,
});

export function useCategoryImageContext(): CategoryImageMapper {
    return useContext(CategoryImageContext);
}

