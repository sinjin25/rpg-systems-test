import registry, { deriveFeatKey } from "../feat2/registry";
import { ClassLevelTable } from "./types";

export default {
    key: 'fighter',
    fortitude: [1, 0, 1, 0, 1],
    reflex: [0, 0, 1, 0, 0],
    will: [0, 0, 1, 0, 0],
    attackBonus: [1, 1, 1, 1, 1],
    classFeats: [
        [deriveFeatKey(registry['martialProficiency']), deriveFeatKey(registry['shieldProficiency']),],
        [deriveFeatKey(registry['hardy']),],
        [
            deriveFeatKey(registry['powerAttack']),
            deriveFeatKey(registry['armorTraining']),
        ],
        [],
        [],
    ],
    hasFreeFeats: [
        [{ levelHasFreeFeats: true }],
        [{ levelHasFreeFeats: true }],
        [{ levelHasFreeFeats: true }],
        [],
        [{ levelHasFreeFeats: true }],
    ],
    classAbilities: [[], [], [], [], []],
} satisfies ClassLevelTable
