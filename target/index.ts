import { Actor2 } from '../actor2'
import abilityFilterBy from './ability-filter-by'
import filterByTeam from './filter-by-team'
import isAlive from './generic-filter/is-alive'
import isTargetable from './generic-filter/is-targetable'
import participantFilterBy from './participant-filter-by'
import priority from './priority'
import { TargetPriority } from './types'

export default (
    enemyTeam: Actor2[],
    allyTeam: Actor2[],
    targetPriority: TargetPriority,
) => {

    const byTeam = targetPriority.team === 'all'
        ? [...enemyTeam, ...allyTeam]
        : targetPriority.team === 'enemy'
            ? [...enemyTeam]
            : [...allyTeam] // .team === 'ally'

    const abilityFilters = targetPriority.filters
    const postAbilityFilter = byTeam.filter(
        actor => {
            return abilityFilterBy(actor, abilityFilters)
        }
    )

    const participantFilters = postAbilityFilter.filter(
        actor => {
            return participantFilterBy(actor, [
                isAlive,
                isTargetable,
            ])
        }
    )

    return priority(
        [...enemyTeam, ...allyTeam],
        [...byTeam],
        [...participantFilters],
        targetPriority,
    )
}