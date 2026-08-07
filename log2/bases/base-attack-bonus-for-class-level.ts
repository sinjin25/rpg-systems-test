import { leaf } from "..";
import { ClassLevels } from "../../character-sheet/class-level/type";
import { attackBonusForClass } from "../../character-sheet/class-level/derive";

export default (cl: ClassLevels) =>
    leaf(cl.displayName, attackBonusForClass(cl))