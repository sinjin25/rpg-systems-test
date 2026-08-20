import type { Actor2, OwnerMaximal } from "."
import newModNode, { leaf, ModNode, sumFunc } from "../log2"
import initiative from "../log2/terminal/initiative"
import maximumHealth from "../log2/terminal/maximum-health"
import roll from "../roll"
import {
    flatFooted,
    newStatusInstance,
} from '../status-sheet2'

export type Speed = {
    remainder: number, // speed remaining until action
    canAct: boolean, // expand to include "stunned" | "dead" etc
}

export type Health = {
    max: number,
    curr: number,
    temporary: number,
}

export const STD_SPEED = 35 // average of 2d6 is 3.5

export const instantiateSpeed = (owner: OwnerMaximal): {
    tree: ModNode,
    speed: Speed,
} => {
    const mod = initiative(owner)
    const rolled = roll(20)
    const r = leaf('d20', rolled)

    const result = newModNode(
        'starting speed',
        [
            mod,
            r,
        ],
        sumFunc,
    )

    return {
        tree: result,
        speed: {
            canAct: true,
            remainder: STD_SPEED - result.total()
        }
    }
}

export const applyFlatFooted = (owner: OwnerMaximal, tree: ModNode) => {
    const duration = STD_SPEED - tree.total()
    if (duration < 0) return

    owner.ss['flatFooted'] = [newStatusInstance(flatFooted(duration), owner)]
}

export const instantiateHealth = (owner: OwnerMaximal): {
    tree: ModNode,
    health: Health,
} => {

    const result = maximumHealth(owner)

    return {
        tree: result,
        health: {
            max: result.total(),
            curr: result.total(),
            temporary: 0,
        }
    }
}

// an actor's max health can change (ex: bear's endurance) -> recalculate health
export const _reinstantiateHealth = (actor: Actor2): {
    tree: ModNode,
    health: Health,
} => {
    const result = instantiateHealth(actor.owner)
    const newMax = result.tree.total()

    // dead actor stays dead (and avoids scaling a negative curr)
    if (actor.health.curr <= 0) {
        return {
            tree: result.tree,
            health: {
                max: newMax,
                curr: 0,
                temporary: actor.health.temporary,
            }
        }
    }

    const currHealthDecimal = Math.min(1,
        actor.health.curr / actor.health.max
    )

    return {
        tree: result.tree,
        health: {
            max: newMax,
            curr: Math.ceil(newMax * currHealthDecimal),
            temporary: actor.health.temporary,
        }
    }
}

// figure out whether or not to change actor health (this is to guard against "random" health changes as a result of ceil
export const reinstantiateHealth = (actor: Actor2) => {
    const re = _reinstantiateHealth(actor)
    if (actor.health.max === re.health.max) return
    actor.health.max = re.health.max
    actor.health.temporary = re.health.temporary
    actor.health.curr = re.health.curr
}