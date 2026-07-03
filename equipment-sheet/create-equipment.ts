import { ContextNames, BroadContexts, EquipmentContextNames } from "../contexts"
import { FeatModFunction, standardFilters } from "../feat/core-types"
import type { BaseEquipment, Weapon, Armor, DamageRollFunc } from "./index.ts"

type EquipmentModInput = {
    whitelist?: ContextNames[],
    blacklist?: ContextNames[],
    mod: number | FeatModFunction,
}

export type CreateEquipmentInput = {
    displayName: string,
    description?: string,
    contexts?: Array<ContextNames | EquipmentContextNames>,
    mods?: { [K in BroadContexts]?: EquipmentModInput },
    damage?: DamageRollFunc,
    ac?: number,
}

export const createEquipment = (input: CreateEquipmentInput): BaseEquipment | Weapon | Armor => {
    const { displayName, description, contexts = [], mods, damage, ac } = input

    const generateAdditionalContexts = mods && Object.fromEntries(
        (Object.entries(mods) as Array<[BroadContexts, EquipmentModInput]>).map(([broadContext, modInput]) => {
            const modFn: FeatModFunction = typeof modInput.mod === 'number'
                ? () => modInput.mod as number
                : modInput.mod
            return [broadContext, {
                applies: standardFilters.noBlacklistAnyWhitelistFactory({
                    whitelist: modInput.whitelist ?? [],
                    blacklist: modInput.blacklist ?? [],
                }),
                mod: modFn,
            }]
        })
    )

    const base: BaseEquipment = {
        displayName,
        ...(description !== undefined ? { description } : {}),
        contexts,
        ...(generateAdditionalContexts ? { generateAdditionalContexts } : {}),
    }

    if (damage) return { ...base, damage }
    if (ac !== undefined) return { ...base, ac }
    return base
}
