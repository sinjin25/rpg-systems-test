import type { Actor } from "../character/actor"

// the point of this is to create testable, pure functions for things like status effects. This handles the actual mutation after they are computed
export const applyHealthDelta = (
    health: Actor['health'],
    delta: number,
): void => {
    let remainingDelta = delta
    const isNegative = remainingDelta < 0

    // damage takes from temporary health first 
    if (isNegative) {
        // delta pos/neg handles whether this is addition or subtraction
        if (health.temporary > 0 && health.temporary >= Math.abs(remainingDelta)) {
            // sufficient temporary health for the whole delta
            health.temporary += remainingDelta
            remainingDelta = 0
        } else if (health.temporary > 0 && health.temporary < Math.abs(remainingDelta)) {
            // insufficient temporary health, partial reduction of total
            remainingDelta += health.temporary
            health.temporary = 0
        }
    }

    // clamp to health.max and 0
    health.curr = Math.min(health.max, Math.max(0, health.curr + remainingDelta))
}

export default applyHealthDelta
