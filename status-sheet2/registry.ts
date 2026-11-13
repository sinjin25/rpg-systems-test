import { StatusEffectWrapper, StatusIds } from './types'
import battleFocusChargingStatus, { battleFocusActiveStatus } from './status/battle-focus'
import bearsEndurance from './status/bears-endurance'
import bless from './status/bless'
import bullsStrength from './status/bulls-strength'
import burningWeaponStatus from './status/burning-weapon'
import catsGrace from './status/cats-grace'
import defensiveRoll from './status/defensive-roll'
import divineProtection from './status/divine-protection'
import fatiguingBlows from './status/fatiguing-blows'
import flatFooted from './status/flat-footed'
import ignite from './status/ignite'
import rageStatus from './status/rage'
import studiedTarget from './status/studied-target'

// generic lets constants derive the key in the editor (as a string literal)
export const deriveStatusKey = <S extends StatusEffectWrapper>(status: S): S['id'] => status.id

// parameterized statuses are instantiated with throwaway args purely for cataloging —
// the registry only needs id/displayName/hidden, never these runtime values
export const registry = {
    [deriveStatusKey(battleFocusChargingStatus(0))]: battleFocusChargingStatus(0),
    [deriveStatusKey(battleFocusActiveStatus())]: battleFocusActiveStatus(),
    [deriveStatusKey(bearsEndurance)]: bearsEndurance,
    [deriveStatusKey(bless)]: bless,
    [deriveStatusKey(bullsStrength)]: bullsStrength,
    [deriveStatusKey(burningWeaponStatus)]: burningWeaponStatus,
    [deriveStatusKey(catsGrace)]: catsGrace,
    [deriveStatusKey(defensiveRoll)]: defensiveRoll,
    [deriveStatusKey(divineProtection(0, 0))]: divineProtection(0, 0),
    [deriveStatusKey(fatiguingBlows)]: fatiguingBlows,
    [deriveStatusKey(flatFooted(0))]: flatFooted(0),
    [deriveStatusKey(ignite)]: ignite,
    [deriveStatusKey(rageStatus)]: rageStatus,
    [deriveStatusKey(studiedTarget)]: studiedTarget,
} satisfies Record<StatusIds, StatusEffectWrapper>

export {
    battleFocusChargingStatus,
    battleFocusActiveStatus,
    bearsEndurance,
    bless,
    bullsStrength,
    burningWeaponStatus,
    catsGrace,
    defensiveRoll,
    divineProtection,
    fatiguingBlows,
    flatFooted,
    ignite,
    rageStatus,
    studiedTarget,
}

export default registry
