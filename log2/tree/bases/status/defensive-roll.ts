import newModNode, { leaf, mapFunc, rollNode } from "../../../";
import { StatusEffectMaximal } from "../../types";

// defensive-roll is a DEFENDER status: when hit, roll 1d4 and subtract it from the incoming damage.
// The die is a frozen roll (rollNode resolves it once at build time and stores the constant, so the
// tree stays pure - see DESIGN.md purity/sealing), wrapped in mapFunc(x => -x) so it REDUCES the sum.
// The 1d4 shows as a positive child under a node whose own total is negative, keeping the die visible.
const defensiveRoll: StatusEffectMaximal = {
    displayName: 'Defensive Roll',
    broadContexts: {
        'damage-taken-status-mod': () =>
            newModNode(
                'Defensive Roll',
                [rollNode('d4', newModNode('Sides', [leaf('Base', 4)]))],
                mapFunc(x => -x),
            ),
    },
}

export default defensiveRoll
