import { Weapon } from '../../../equipment-sheet/index.ts'
import roll from '../../../roll/index.ts'

export const shortsword: Weapon = {
    contexts: ['shortsword', 'melee'],
    displayName: 'shortsword',
    damage: () => roll(6),
}
