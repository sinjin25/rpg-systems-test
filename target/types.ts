// flow
// grab participants
// filter by team
// filter by ability
// inclusion, exclusion, intercept
// filter by enemy rules
// ex: invisible, dead
// apply targeting rules

import { Actor2 } from "../actor2"
import { GenericFilter } from "./generic-filter/types"

export type OverrideFunction = (
    fullParticipants: Actor2[],
    fullTeam: Actor2[],
    validTargets: Actor2[],
) => Actor2[]

export type TargetPriority = {
    simple: 'first' | 'last' | 'all'
    override?: OverrideFunction,
    team: 'all' | 'enemy' | 'ally'
    filters: GenericFilter[],
}