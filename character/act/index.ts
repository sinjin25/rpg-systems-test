import { AbilitySheet } from "../../ability-sheet"
import { takeNextAbility } from "../actor"
import useAbility, { AbilityActionResult } from "./ability"
import useAttack, { AttackRequiredData, StandardActionResult } from "./attack"

export type { StandardActionResult } from "./attack"

type ActRequiredData = AttackRequiredData & { as: AbilitySheet }

/*
act will precompute everything but has no opinions on interpreting them
Ex: damage will roll even if the attack will not hit
Ex: crit confirmation will roll even if the attack does not threaten
Ex: crit multiplier is determined but it doesn't know how that's applied to damage (some things scale, some don't)

simulate is responsible for interpreting these against targets
*/
type ActResult = Array<StandardActionResult | AbilityActionResult>
export const act = (data: ActRequiredData): ActResult => {
    const results: ActResult = []

    // a turn is [free, ...standard, swift]
    const free = takeNextAbility(data.as.free, { wrap: true })
    if (free) results.push(useAbility({ ...data, ability: free }))

    // standard slots do not wrap, they just do standard attacks when it's out of items
    const standard = takeNextAbility(data.as.standard)
    if (standard) results.push(useAbility({ ...data, ability: standard }))
    else results.push(...useAttack(data))

    const swift = takeNextAbility(data.as.swift, { wrap: true })
    if (swift) results.push(useAbility({ ...data, ability: swift }))

    return results
}
