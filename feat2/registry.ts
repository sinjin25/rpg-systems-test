import { Feat2, FeatIds } from './types'
import armorTraining from './feats/armor-training'
import battleFocus from './feats/battle-focus'
import divineProtection from './feats/divine-protection'
import fatiguingBlows from './feats/fatiguing-blows'
import improvedInitiative from './feats/improved-initiative'
import improvedRage from './feats/improved-rage'
import rage from './feats/rage'
import conSaves from './feats/con-saves'
import powerAttack from './feats/power-attack'
import dodge from './feats/dodge'
import featExoticProficiency from './feats/exotic-proficiency'
import featMartialProficiency from './feats/martial-proficiency'
import featShieldProficiency from './feats/shield-proficiency'
import featTowerShieldProficiency from './feats/tower-shield-proficiency'
import finesseWeaponFighting from './feats/finesse-weapon-fighting'
import meleeWeaponFighting from './feats/melee-weapon-fighting'
import shieldMastery from './feats/shield-mastery'
import heavyArmorMastery from './feats/heavy-armor-mastery'
import critFocus from './feats/crit-focus'
import improvedCritical from './feats/improved-critical'
// do not include in registry
import { testFeatMeleeWeaponFighting } from './feats/test-feats'

// generic lets constants derive the key in the editor (as a string literal)
export const deriveFeatKey = <F extends Feat2>(feat: F): F['displayName'] => feat.displayName

// missing or extra keys vs FeatIds are a type error here
export const registry = {
    [deriveFeatKey(armorTraining)]: armorTraining,
    [deriveFeatKey(battleFocus)]: battleFocus,
    [deriveFeatKey(divineProtection)]: divineProtection,
    [deriveFeatKey(fatiguingBlows)]: fatiguingBlows,
    [deriveFeatKey(improvedInitiative)]: improvedInitiative,
    [deriveFeatKey(improvedRage)]: improvedRage,
    [deriveFeatKey(rage)]: rage,
    [deriveFeatKey(conSaves)]: conSaves,
    [deriveFeatKey(powerAttack)]: powerAttack,
    [deriveFeatKey(dodge)]: dodge,
    [deriveFeatKey(featExoticProficiency)]: featExoticProficiency,
    [deriveFeatKey(featMartialProficiency)]: featMartialProficiency,
    [deriveFeatKey(featShieldProficiency)]: featShieldProficiency,
    [deriveFeatKey(featTowerShieldProficiency)]: featTowerShieldProficiency,
    [deriveFeatKey(finesseWeaponFighting)]: finesseWeaponFighting,
    [deriveFeatKey(meleeWeaponFighting)]: meleeWeaponFighting,
    [deriveFeatKey(shieldMastery)]: shieldMastery,
    [deriveFeatKey(heavyArmorMastery)]: heavyArmorMastery,
    [deriveFeatKey(critFocus)]: critFocus,
    [deriveFeatKey(improvedCritical)]: improvedCritical,
} satisfies Record<FeatIds, Feat2>

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
    featExoticProficiency,
    featMartialProficiency,
    featShieldProficiency,
    featTowerShieldProficiency,
    finesseWeaponFighting,
    meleeWeaponFighting,
    shieldMastery,
    heavyArmorMastery,
    critFocus,
    improvedCritical,
}

export default registry
