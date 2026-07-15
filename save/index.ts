import { fortitudeSaveModifierFactory } from './variants/fortitude'
import { reflexSaveModifierFactory } from './variants/reflex'
import { SaveModifierFuncFactory, SaveType } from './types'

export { fortitudeSaveModifierFactory } from './variants/fortitude'
export { reflexSaveModifierFactory } from './variants/reflex'
export { saveSucceeds } from './save-succeeds'
export type { SaveType, SaveModifierFunc, SaveModifierFuncFactory, SaveModifierRequiredData } from './types'

// resolves a SaveType to the factory that builds its modifier, so callers (e.g. the
// status decay pass) can pick a save by name without switching on the type themselves
export const saveModifierFactories: Record<SaveType, SaveModifierFuncFactory> = {
    fortitude: fortitudeSaveModifierFactory,
    reflex: reflexSaveModifierFactory,
}
