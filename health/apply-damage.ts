import type { Actor } from "../character/actor"

// the point of this is to create testable, pure functions for things like status effects. This handles the actual mutation after they are computed
// intent is explicit: this only ever reduces health. A non-positive amount deals 0
// (rather than the old signed convention, where a negative "damage" would heal).
export const applyDamage = (
    health: Actor['health'],
    amount: number,
): void => {
    let remaining = Math.max(0, amount)

    // damage takes from temporary health first
    if (health.temporary > 0) {
        if (health.temporary >= remaining) {
            // sufficient temporary health for the whole hit
            health.temporary -= remaining
            remaining = 0
        } else {
            // insufficient temporary health, partial reduction of the total
            remaining -= health.temporary
            health.temporary = 0
        }
    }

    health.curr = Math.max(0, health.curr - remaining)
}

export default applyDamage
