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
// do not include in registry
import { testFeatMeleeWeaponFighting } from './feats/test-feats'

// generic lets constants derive the key in the editor (as a string literal)
export const deriveFeatKey = <F extends Feat2>(feat: F): F['displayName'] => feat.displayName

// missing or extra keys vs FeatIds are a type error here
export const registry: Record<FeatIds, Feat2> = {
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
}

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
}

export default registry
