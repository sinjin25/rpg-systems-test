import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerLog2 } from "../../types";
import statusContribution from "./status-contribution";

// pretty sure this should be a member of fortitude, will, reflex
// and this wasn't finished
type Member = 'fortitude' | 'reflex' | 'will'

export default (member: Member) => (owner: OwnerLog2) => statusContribution(`${member}-status-mod`)(owner)