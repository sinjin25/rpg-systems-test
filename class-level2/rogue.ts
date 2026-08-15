import { ClassLevel } from "./types";
export default {
    key: 'rogue',
    fortitude: [0, 0, 1, 0, 0],
    reflex: [2, 1, 0, 1, 0],
    will: [1, 0, 1, 0, 1],
    attackBonus: [0, 1, 1, 1, 0],
    classFeats: [[], [], [], [], []],
    hasFreeFeats: [false, false, false, false, false],
} satisfies ClassLevel
