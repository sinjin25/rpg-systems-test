import { LookupTableValue } from "../types";

export const STD_WEIGHT = 100

export const tuplesToLookupTableValues = (
    // max, min, weightmult
    values: [number, number, number][]
): LookupTableValue[] => {
    return values.map(a => ({
        max: a[0],
        min: a[1],
        weight: STD_WEIGHT * a[2]
    }))
}
