import { leaf } from "../..";
import { ClassLevels } from "../../../../character-sheet/class-level/type";
import { fortitudeSaveForClass, reflexSaveForClass } from "../../../../character-sheet/class-level";
import { SaveType } from "../composition/base-save";

// Base save contributed by a SINGLE class: the class's display name over one flat number - the sum of
// its per-level save bonuses (fort or ref) across the levels actually acquired. Deliberately NOT one
// node per level, exactly like base-attack-bonus-for-class-level: a "Fighter 4" reads better than four
// stacked leaves and the per-level breakdown adds nothing to understanding the total.
const saveForClass: Record<SaveType, (cl: ClassLevels) => number> = {
    fortitude: fortitudeSaveForClass,
    reflex: reflexSaveForClass,
}

const baseSaveForClassLevel = (cl: ClassLevels, saveType: SaveType) =>
    leaf(cl.displayName, saveForClass[saveType](cl))

export default baseSaveForClassLevel
