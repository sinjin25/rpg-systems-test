import type { OwnerMaximal, Actor2 } from "../../actor2/types"
import type { EquipmentBlueprint } from "../../equipment-sheet2/factory/types"
import type { EquipmentSlot } from "../../equipment-sheet2/types"

export type FrozenEquipmentSheet = { [K in EquipmentSlot]?: EquipmentBlueprint }

export type OwnerMaximalSnapshot = Omit<OwnerMaximal, 'es'> & { es: FrozenEquipmentSheet }

export type Actor2Snapshot = Omit<Actor2, 'owner'> & { owner: OwnerMaximalSnapshot }
