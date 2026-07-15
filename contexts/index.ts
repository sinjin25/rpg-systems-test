// 'dc' boosts save DCs the character imposes on others (abilities), distinct
// from 'save' which boosts the character's own saving throws
export type BroadContexts = 'save' | 'attack' | 'skill' | 'damage' | 'health' | 'stat' | 'initiative' | 'ac' | 'critRange' | 'critMultiplier' | 'dc'
export type BasicContexts = 'melee' | 'ranged' | 'magic' | 'finesse' | 'constitution' | 'dexterity' | 'natural'
export type EquipmentContextNames = 'dagger' | 'shortsword' | 'bow'
// 'all' in a whitelist is an explicit opt-in to "applies to everything not blacklisted"
export type ContextNames = BasicContexts | EquipmentContextNames | 'all'