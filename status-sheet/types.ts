import { StatusEffect } from "./core-types"

// keys are runtime-assigned ids (e.g. 'flatFooted'), not a closed union like FeatSheet's
// PossibleFeatKeys, since status instances (and their expiration data) are created
// dynamically per-actor rather than declared as a fixed catalog
export type StatusSheet = {
    [key: string]: StatusEffect
}

export const defaultStatusSheet: StatusSheet = {}
