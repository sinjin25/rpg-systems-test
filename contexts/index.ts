export type BroadContexts = 'save' | 'attack' | 'skill' | 'damage' | 'health' | 'stat'
export type BasicContexts = 'melee' | 'ranged' | 'magic' | 'finesse' | 'constitution'
export type EquipmentContextNames = 'dagger' | 'shortsword' | 'bow'
// 'all' in a whitelist is an explicit opt-in to "applies to everything not blacklisted"
export type ContextNames = BasicContexts | EquipmentContextNames | 'all'