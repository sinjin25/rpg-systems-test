import { CharacterSheet } from "../character-sheet"
import { act } from "../character/act"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import roll from "../roll"
import { RollModifierRequiredData } from "../roll-modifier/types"

export const STANDARD_SPEED = 35 // average of 2d6 is 3.5

type Speed = {
    remainder: number,
    canAct: boolean, // expand to include things like "stunned" vs "dead"
}

type TurnData = {
    speed: Speed,
    owner: {
        cs: CharacterSheet,
        fs: FeatSheet,
        es: EquipmentSheet,
        ss: {}
    },
}

type Round = {
    participants: TurnData[],
    speedSum: number,
}

// should consider things like status effects, etc.
export const speedRoll = (
    data: TurnData['owner'],
) => {
    return roll(6) + roll(6)
}

export const round = (
    data: Round,
) => {
    const acting: Round['participants'] = []
    for (let part of data.participants) {
        if (!part.speed.canAct) continue
        // roll
        const roll = speedRoll(part.owner)
        part.speed.remainder += roll
        if (part.speed.remainder >= data.speedSum) {
            part.speed.remainder -= data.speedSum
            acting.push(part)
        }
    }

    return acting
}