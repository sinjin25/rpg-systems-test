import newModNode from "../..";
import { OwnerMaximal } from "../types";

// the raw str SCORE, not a modifier. summing every str source (this, statuses) happens in
// score space; modded-str owns the single stat->modifier conversion.
const newRawStr = (owner: OwnerMaximal) => newModNode(
    'Raw Str',
    [],
    () => owner.cs.str
)

export default newRawStr
