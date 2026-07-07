import { ContextNames, BroadContexts, EquipmentContextNames } from "../contexts"
import { FeatContext, FeatModFunction, standardFilters } from "../feat/core-types"
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
    // +N enhancement bonus: applies +N to both attack and damage, unconditionally
    enhancement?: number,
    damage?: DamageRollFunc,
    ac?: number,
}

export const createEquipment = (input: CreateEquipmentInput): BaseEquipment | Weapon | Armor => {
    const { displayName, description, contexts = [], mods, enhancement, damage, ac } = input

    const modsContext = mods && Object.fromEntries(
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
    ) as FeatContext | undefined

    const enhancementApplies = standardFilters.noBlacklistAnyWhitelistFactory({
        whitelist: ['all'],
        blacklist: [],
    })
    const enhancementContext: FeatContext | undefined = enhancement !== undefined
        ? {
            attack: { applies: enhancementApplies, mod: () => enhancement },
            damage: { applies: enhancementApplies, mod: () => enhancement },
        }
        : undefined

    const generateAdditionalContexts = [modsContext, enhancementContext]
        .filter((c): c is FeatContext => !!c)

    const base: BaseEquipment = {
        displayName,
        ...(description !== undefined ? { description } : {}),
        contexts,
        ...(generateAdditionalContexts.length ? { generateAdditionalContexts } : {}),
    }

    if (damage) return { ...base, damage }
    if (ac !== undefined) return { ...base, ac }
    return base
}
