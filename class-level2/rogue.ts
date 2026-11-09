import { getAbilityKey } from "../ability-sheet2";
import studiedTarget from "../ability-sheet2/abilities2/studied-target";
import type { ClassLevelTable } from "./types";
export default {
    key: 'rogue',
    fortitude: [0, 0, 1, 0, 0],
    reflex: [2, 1, 0, 1, 0],
    will: [1, 0, 1, 0, 1],
    attackBonus: [0, 1, 1, 1, 0],
    classFeats: [[], [], [], [], []],
    hasFreeFeats: [[], [], [], [], []],
    classAbilities: [[getAbilityKey(studiedTarget)], [], [], [], []],
} satisfies ClassLevelTable
