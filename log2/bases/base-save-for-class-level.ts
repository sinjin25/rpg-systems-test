import { leaf } from "..";
import { ClassLevels } from "../../character-sheet/class-level/type";
import { fortitudeSaveForClass, reflexSaveForClass } from "../../character-sheet/class-level/derive";
import { SaveType } from "../composition/base-save";

// resolved at call time, not module-eval time: class-level/index.ts is reached again
// through this file's own import chain, so its `const` exports are still in TDZ when
// this module body runs. Hoisting them into a record here captures `undefined`.
const saveForClass = (saveType: SaveType): ((cl: ClassLevels) => number) =>
    saveType === 'fortitude' ? fortitudeSaveForClass : reflexSaveForClass

export default (cl: ClassLevels, saveType: SaveType) =>
    leaf(cl.displayName, saveForClass(saveType)(cl))