import { EquipmentBlueprint } from "./types";
import { EquipmentSlot } from "../types";
import { getModByRank, getModValueByPerfection, ModPosition } from "./util";
import newModNode, { ModNode, sumFunc } from "../../log2";
import { ModNodeOpts, OwnerLog2 } from "../../log2/types";
import rollTree from "../../log2/roll";
import { RollDamageSource } from "./types";

/* 
To clarify this file's roll: this creates broadContexts for a BaseEquipment where leaf values are unsuitable (rolls)
blueprint -> broadContext handlers -> base item -> log2

for example .damage broadContext is used by damage-of-equipment-piece.ts
for example .roll-damage broadContext is used by terminal/damage.ts
*/

// from rpg-tests\log2\types.ts
type BroadContextHandler = (owner: OwnerLog2, opts: ModNodeOpts) => ModNode | undefined

export const collectRollDamageSources = (
    slot: EquipmentSlot,
    blueprint: EquipmentBlueprint,
): RollDamageSource[] => {
    const sources: RollDamageSource[] = []

    const relevantAffix = [...blueprint.affix.filter(a => a.kind === 'roll-damage'),]
    const relevantSuffix = [...blueprint.suffix.filter(a => a.kind === 'roll-damage'),]
    const relevantImplicit = (blueprint.base?.implicit ?? []).filter(a => a.kind === 'roll-damage')

    relevantAffix.forEach(ebm => {
        const ltv = getModByRank(slot, 'affix', ebm.kind, ebm.rank)
        if (!ltv) return
        sources.push({ label: `${ebm.kind} T${ebm.rank}`, sides: getModValueByPerfection(ltv, ebm.perfection) })
    })
    relevantSuffix.forEach(ebm => {
        const ltv = getModByRank(slot, 'suffix', ebm.kind, ebm.rank)
        if (!ltv) return
        sources.push({ label: `${ebm.kind} T${ebm.rank}`, sides: getModValueByPerfection(ltv, ebm.perfection) })
    })
    relevantImplicit.forEach((mod) => {
        sources.push({ label: `${mod.kind} implicit`, sides: mod.value })
    })

    return sources
}

// base weapon's own damage die (ex: longsword -> 1d8), rolled live rather than baked in
export const buildDamageBroadContext = (displayName: string, diceSides: number): BroadContextHandler =>
    (o: OwnerLog2, opts: ModNodeOpts = {}) => {
        return newModNode(displayName, [
            rollTree({ diceSides })(o, opts)
        ], sumFunc)
    }

// we need to build a custom broadContext which can make different roll results at runtime
export const buildRollDamageModBroadContext = (displayName: string, sources: RollDamageSource[]): BroadContextHandler => {

    const broadContext: BroadContextHandler = (o: OwnerLog2, opts: ModNodeOpts = {}) => {

        const children = sources.map((source) => {
            const { label, sides } = source

            return newModNode(
                label,
                [
                    rollTree(
                        { diceSides: sides, member: 'damage-sides-mod' })(o, opts)
                ],
                sumFunc
            )
        })

        const node = newModNode(displayName, children, sumFunc)

        return node
    }

    return broadContext
}