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

export const nativeFeats: Record<AllFeats, FeatMaximal> = {
    'finesse-weapon-fighting': finesseWeaponFighting,
    'melee-weapon-fighting': meleeWeaponFighting,
    'dodgy': dodgy,
    'shield-mastery': shieldMastery,
    'heavy-armor-mastery': heavyArmorMastery,
    'crit-focus': critFocus,
    'improved-critical': improvedCritical,
}
