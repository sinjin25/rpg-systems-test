// create a whitelist of things to strip if empty

import { ModNode } from ".";
import { EveryTree } from "./types";

type LiteralRecord = Partial<Record<EveryTree, true>>
const DEFAULT_STRIP_DN: LiteralRecord = {
    'attack-equipment-mod': true,
    'crit-multiplier-equipment-mod': true,
    'crit-threat-range-equipment-mod': true,
    'flat-damage-equipment-mod': true,
    'speed-equipment-mod': true,
    'initiative-equipment-mod': true,
    'damage-taken-equipment-mod': true,
    'health-equipment-mod': true,
    'fortitude-equipment-mod': true,
    'will-equipment-mod': true,
    'reflex-equipment-mod': true,
    'proficiency-penalty': true,
}

const shouldStrip = (
    node: ModNode | undefined,
    stripIfIn: LiteralRecord,
) => {
    if (node === undefined) return true
    if (node.total() !== 0) return false
    if (!stripIfIn[node.displayName as EveryTree]) return false
    return true
}

export const stripSelectModNodeIfEmpty = (
    children: ModNode[],
    customModNode?: LiteralRecord
): ModNode[] => {
    return children.filter(a => !shouldStrip(a, customModNode || DEFAULT_STRIP_DN))
}
