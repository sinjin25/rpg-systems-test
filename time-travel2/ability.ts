import { Handlers } from "./types"
import freezeAbilityModNode from "./snapshot/ability"

const ability: Handlers['ability'] = (input) => {
    const { abilityModNode, source, to } = input
    const famn = freezeAbilityModNode(abilityModNode)

    return { kind: 'ability', ...famn, source, to }
}

export default ability
