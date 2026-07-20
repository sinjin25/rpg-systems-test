import { fighterClassLevels } from './fighter'
import { ClassLevelMember, ClassLevels } from './type'

// table template for a classes's feats, bonuses at given levels
export type ClassDefinition = {
    displayName: string,
    data: ClassLevelMember[],
}

export const classRegistry: Record<string, ClassDefinition> = {
    fighter: { displayName: 'Fighter', data: fighterClassLevels },
}

// return a copy of a class's table and supporting properties
export const instantiateClassLevels = (className: string): ClassLevels | undefined => {
    const def = classRegistry[className]
    if (!def) return undefined
    return { displayName: def.displayName, data: def.data, level: 0 }
}
