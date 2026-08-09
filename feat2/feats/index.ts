import { Feat2 } from '..'
import armorTraining from './armor-training'
import battleFocus from './battle-focus'
import divineProtection from './divine-protection'
import fatiguingBlows from './fatiguing-blows'
import improvedInitiative from './improved-initiative'
import improvedRage from './improved-rage'
import rage from './rage'
import conSaves from './con-saves'
import powerAttack from './power-attack'
// do not include in possibleFeatKeys
import { testFeatMeleeWeaponFighting } from './test-feats'
import dodge from './dodge'

export const deriveFeatName = (feat: Feat2) => feat.displayName

// 
export const possibleFeatKeys = {
    [armorTraining.displayName]: armorTraining,
    [battleFocus.displayName]: battleFocus,
    [divineProtection.displayName]: divineProtection,
    [fatiguingBlows.displayName]: fatiguingBlows,
    [improvedInitiative.displayName]: improvedInitiative,
    [improvedRage.displayName]: improvedRage,
    [rage.displayName]: rage,
    [conSaves.displayName]: conSaves,
    [powerAttack.displayName]: powerAttack,
    [dodge.displayName]: dodge,
} satisfies Record<string, Feat2>

// 'Armor Training' | 'Battle Focus' | ... etc
export type PossibleFeatKey = keyof typeof possibleFeatKeys

export type PossibleFeats = typeof possibleFeatKeys

export {
    armorTraining,
    battleFocus,
    divineProtection,
    fatiguingBlows,
    improvedInitiative,
    improvedRage,
    rage,
    testFeatMeleeWeaponFighting,
    conSaves,
    powerAttack,
}

export default possibleFeatKeys