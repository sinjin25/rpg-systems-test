import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import statusContribution from "./status/status-contribution";

// pretty sure this should be a member of fortitude, will, reflex
// and this wasn't finished
type Member = 'fortitude' | 'reflex' | 'will'

export default (member: Member) => (owner: OwnerMaximal) => statusContribution(`${member}-status-mod`)(owner)