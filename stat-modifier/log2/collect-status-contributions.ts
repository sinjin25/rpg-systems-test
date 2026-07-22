import { ModNode, newModNode, leaf, sumFunc } from ".";
import { StatusEffect } from "../../status-sheet";
import { ModResult } from "../log";
import { BroadContextsMaximal, OwnerMaximal, StatusEffectMaximal } from "./tree/types";

// --- the throwaway bridge between the legacy StatusEffect stored in owner.ss and log2's
// StatusEffectMaximal. When legacy dies, deleting this file's two casts retires the whole bridge.

// read seam: pull every status off the runtime sheet that declares a contribution to `broadContext`.
// Statuses absent from owner.ss contribute nothing - presence in the sheet IS the condition.
export const collectStatusContributions = (
    owner: OwnerMaximal,
    broadContext: BroadContextsMaximal,
): ModNode[] =>
    Object.values(owner.ss)
        .map(s => (s as unknown as StatusEffectMaximal).broadContexts?.[broadContext])
        .filter((f): f is NonNullable<typeof f> => !!f)
        .map(f => f(owner))

// write seam: place a log2 status into a legacy-typed status sheet slot (used by tests).
export const asStatus = (s: StatusEffectMaximal): StatusEffect => s as unknown as StatusEffect

// bridge the legacy context-tag calculators (calculateFeatMod / calculateStatusMod) into log2: a
// ModResult already carries one { displayName, amount } entry per *applying* source, so each becomes
// a child leaf and the node folds with sumFunc. An empty result -> no children -> 0. This keeps the
// per-source breakdown as the node's explanation while the legacy engine does the tag filtering.
export const modResultToNode = (displayName: string, result: ModResult): ModNode =>
    newModNode(displayName, result.entries.map(e => leaf(e.displayName, e.amount)), sumFunc)
