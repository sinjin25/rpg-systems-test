import { TimeTravelAugmenter } from './types'
import { TTLogKeys } from '../types'

export type JsonAugmentedLogMap = { [K in TTLogKeys]: string }

// a status instance's `source` is the owner it's attached to for self-buffs (flatFooted, rage,
// ...), which closes a cycle JSON.stringify can't walk. The frozen `tick`/`expiration` already
// carry whatever source contributed at apply time, so display consumers don't need it.
export const dropStatusInstanceSource = function (this: unknown, key: string, value: unknown): unknown {
    if (key === 'source' && this !== null && typeof this === 'object' && 'pointer' in this) {
        return undefined
    }
    return value
}

const toJson = (log: unknown) => JSON.stringify(log, dropStatusInstanceSource)

export const ttrvJsonAugmenter: TimeTravelAugmenter<JsonAugmentedLogMap> = {
    'fight-start': toJson,
    'standard-action-result': toJson,
    'speed': toJson,
    'team-victory': toJson,
    'act-start': toJson,
    'damage-over-time-taken': toJson,
    'heal-over-time-taken': toJson,
    'actor-death': toJson,
    'ability': toJson,
    'pre-fight-feat-applied': toJson,
    'post-fight': toJson,
}

export default ttrvJsonAugmenter
