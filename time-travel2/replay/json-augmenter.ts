import { TimeTravelAugmenter } from './types'
import { TTLogKeys } from '../types'

export type JsonAugmentedLogMap = { [K in TTLogKeys]: string }

const toJson = (log: unknown) => JSON.stringify(log)

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
}

export default ttrvJsonAugmenter
