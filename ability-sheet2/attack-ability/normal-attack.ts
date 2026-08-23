// proof of concept: the simplest AttackAbility - a single weapon attack against the first enemy.
// the SAR supplies weapon damage (and crit damage) automatically, and a hookless payload resolves via
// the no-op fallthrough in resolveHook, so nothing extra is needed.
import { AttackAbility, AttackAbilitySheetDefinition } from './types'

const factory = (): AttackAbility => ({
    steps: [{
        tp: { filters: [], simple: 'first', team: 'enemy' },
        payload: [{}], // no hooks -> just the weapon attack
    }],
})

export const normalAttack: AttackAbilitySheetDefinition = {
    kind: 'attack',
    castType: 'standard',
    displayName: 'normal attack',
    description: 'A single weapon attack against the first enemy.',
    factory,
}

export default normalAttack
