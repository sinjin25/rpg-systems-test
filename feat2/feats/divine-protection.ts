import { leaf } from "../../log2";
import { Feat2 } from "..";
import roll from "../../roll";
import { divineProtection as dpStatus } from "../../status-sheet2";

const displayName = 'Divine Protection'
export default {
    displayName,
    broadContexts: {},
    description: 'Gain 1d4 temporary AC for 1d4 rounds',
    onFightStart: () => dpStatus(roll(4), roll(4)),
} as const satisfies Feat2