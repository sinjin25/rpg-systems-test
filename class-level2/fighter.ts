import registry, { deriveFeatKey } from "../feat2/registry";
import { ClassLevelTable } from "./types";

export default {
    key: 'fighter',
    fortitude: [1, 0, 1, 0, 1],
    reflex: [0, 0, 1, 0, 0],
    will: [0, 0, 1, 0, 0],
    attackBonus: [1, 1, 1, 1, 1],
    classFeats: [
        [deriveFeatKey(registry['Martial Proficiency']), deriveFeatKey(registry['Shield Proficiency']),],
        [deriveFeatKey(registry['Hardy']),],
        [
            deriveFeatKey(registry['Power Attack']),
            deriveFeatKey(registry['Armor Training']),
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
    ]
} satisfies ClassLevelTable
