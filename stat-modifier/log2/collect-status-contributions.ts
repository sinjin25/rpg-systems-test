import { ModNode, newModNode, leaf, sumFunc } from ".";
import { ModResult } from "../log";
import { BroadContextsMaximal, OwnerMaximal } from "./tree/types";

// read seam: pull every status off owner.ss that declares a contribution to `broadContext`. owner.ss
// holds StatusEffectMaximal objects directly now (no legacy cast), so this is a plain read. Two ways a
// status contributes nothing: it isn't on the sheet, or its producer returns undefined because it
// doesn't apply here (e.g. weapon tags don't match). Both are filtered - presence IS the condition.
export const collectStatusContributions = (
    owner: OwnerMaximal,
    broadContext: BroadContextsMaximal,
): ModNode[] =>
    Object.values(owner.ss)
        .map(s => s.broadContexts?.[broadContext])
        .filter((f): f is NonNullable<typeof f> => !!f)
        .map(f => f(owner))
        .filter((node): node is ModNode => !!node)

// bridge the legacy context-tag calculator into log2 (only attack-equipment-mod still uses this now;
// the feat and status paths route natively): a ModResult already carries one { displayName, amount }
// entry per *applying* source, so each becomes a child leaf and the node folds with sumFunc. An empty
// result -> no children -> 0. The per-source breakdown stays as the node's explanation while the
// legacy engine does the tag filtering.
export const modResultToNode = (displayName: string, result: ModResult): ModNode =>
    newModNode(displayName, result.entries.map(e => leaf(e.displayName, e.amount)), sumFunc)
