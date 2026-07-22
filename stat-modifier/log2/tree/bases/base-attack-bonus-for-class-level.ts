import { leaf } from "../..";
import { ClassLevels } from "../../../../character-sheet/class-level/type";
import { attackBonusForClass } from "../../../../character-sheet/class-level";

// BAB contributed by a SINGLE class: the class's display name over one flat number - the sum of its
// per-level attack bonuses across the levels actually acquired. Deliberately NOT one node per level:
// a "Fighter 4" reads better than four stacked "+1" leaves and the per-level breakdown adds nothing
// to understanding the total.
const baseAttackBonusForClassLevel = (cl: ClassLevels) =>
    leaf(cl.displayName, attackBonusForClass(cl))

export default baseAttackBonusForClassLevel
