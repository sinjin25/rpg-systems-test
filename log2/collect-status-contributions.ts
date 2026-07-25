import { ModNode, newModNode, leaf, sumFunc } from ".";
import { ModResult } from "../stat-modifier/log";
import { BroadContextsMaximal, OwnerMaximal } from "./types";

// given a broadContext (key), collect relevant items
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
