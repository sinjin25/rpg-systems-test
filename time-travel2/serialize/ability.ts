import { Handlers } from "../types"
import serializeAbilityResolutions from "./ability-resolution"

const ability: Handlers['ability'] = (input) => {
    const { resolutions, source, to, abilityId, abilityName } = input
    return {
        kind: 'ability',
        source,
        to,
        abilityId,
        abilityName,
        resolutions: serializeAbilityResolutions(resolutions),
    }
}

export default ability
