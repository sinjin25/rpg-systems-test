import { AllFeats, FeatMaximal } from "../types";
import finesseWeaponFighting from "./finesse-weapon-fighting";
import meleeWeaponFighting from "./melee-weapon-fighting";
import dodgy from "./dodgy";
import shieldMastery from "./shield-mastery";
import heavyArmorMastery from "./heavy-armor-mastery";
import critFocus from "./crit-focus";
import improvedCritical from "./improved-critical";

export {
    finesseWeaponFighting,
    meleeWeaponFighting,
    dodgy,
    shieldMastery,
    heavyArmorMastery,
}

// registry of every native feat, keyed by displayName. Placing a feat on owner.fs is what activates it;
// this map is the menu to pick from.
export const nativeFeats: Record<AllFeats, FeatMaximal> = {
    'finesse-weapon-fighting': finesseWeaponFighting,
    'melee-weapon-fighting': meleeWeaponFighting,
    'dodgy': dodgy,
    'shield-mastery': shieldMastery,
    'heavy-armor-mastery': heavyArmorMastery,
    'crit-focus': critFocus,
    'improved-critical': improvedCritical,
}
