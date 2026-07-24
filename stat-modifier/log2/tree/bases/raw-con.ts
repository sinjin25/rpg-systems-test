import newModNode from "../..";
import { OwnerMaximal } from "../types";

// the raw con SCORE, not a modifier. summing every con source (this, statuses, equipment) happens in
// score space; modded-con owns the single stat->modifier conversion.
const newRawCon = (owner: OwnerMaximal) => newModNode(
    'Raw Con',
    [],
    () => owner.cs.con
)

export default newRawCon
