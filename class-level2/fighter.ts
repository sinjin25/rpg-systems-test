import { ClassLevel } from "./types";

export default {
    key: 'fighter',
    fortitude: [1, 0, 1, 0, 1],
    reflex: [0, 0, 1, 0, 0],
    attackBonus: [1, 1, 1, 1, 1],
    classFeats: [
        ['Improved Initiative'],
        ['Hardy'],
        [
            'Power Attack',
            'Armor Training',
        ],
        [],
        [],
    ],
    hasFreeFeats: [true, false, true, false, true]
} satisfies ClassLevel
