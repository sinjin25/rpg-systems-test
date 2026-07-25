import newModNode from "../..";
import { OwnerMaximal } from "../types";

// the raw dex SCORE, not a modifier. summing every dex source (this, statuses, equipment)
// happens in score space; modded-dex owns the single stat->modifier conversion.
const newRawDex = (owner: OwnerMaximal) => newModNode(
    'Raw Dex',
    [],
    () => owner.cs.dex
)

export default newRawDex