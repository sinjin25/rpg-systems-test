import { ModNode } from ".";
import { FeatBroadContexts, OwnerMaximal } from "./tree/types";

// Feats contribute natively, the same way statuses do (see collect-status-contributions.ts) - only
// they live on owner.fs and route into their own aggregator nodes. owner.fs holds FeatMaximal objects
// directly now (no legacy cast), so this is a plain read.

// read seam: pull every feat off owner.fs that declares a contribution to `broadContext`. Two ways a
// feat contributes nothing: it isn't on the sheet at all, or it's on the sheet but its producer
// returns undefined because it doesn't apply here (e.g. weapon tags don't match). Both are filtered,
// so a gated-out feat leaves no leaf in the outline.
export const collectFeatContributions = (
    owner: OwnerMaximal,
    broadContext: FeatBroadContexts,
): ModNode[] =>
    Object.values(owner.fs)
        .map(f => f.broadContexts?.[broadContext])
        .filter((fn): fn is NonNullable<typeof fn> => !!fn)
        .map(fn => fn(owner))
        .filter((node): node is ModNode => !!node)
