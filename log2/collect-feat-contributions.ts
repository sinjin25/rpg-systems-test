import { ModNode } from ".";
import { FeatBroadContexts, OwnerMaximal } from "./types";

// given a broadcontext (key on an object), collect relevant items
export const collectFeatContributions = (
    owner: OwnerMaximal,
    broadContext: FeatBroadContexts,
): ModNode[] =>
    Object.values(owner.fs)
        .map(f => f.broadContexts?.[broadContext])
        .filter((fn): fn is NonNullable<typeof fn> => !!fn)
        .map(fn => fn(owner))
        .filter((node): node is ModNode => !!node)
