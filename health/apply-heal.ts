import { Actor2 } from "../actor2"

export const applyHeal = (
    health: Actor2['health'],
    amount: number,
): void => {
    const heal = Math.max(0, amount)
    health.curr = Math.min(health.max, health.curr + heal)
}

export default applyHeal
