import { leaf } from "../..";
import { ClassLevels } from "../../../character-sheet/class-level/type";
import { fortitudeSaveForClass, reflexSaveForClass } from "../../../character-sheet/class-level";
import { SaveType } from "../composition/base-save";

const saveForClass: Record<SaveType, (cl: ClassLevels) => number> = {
    fortitude: fortitudeSaveForClass,
    reflex: reflexSaveForClass,
}

export default (cl: ClassLevels, saveType: SaveType) =>
    leaf(cl.displayName, saveForClass[saveType](cl))