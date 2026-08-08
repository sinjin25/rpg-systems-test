import { StatusEffect } from "../../status-sheet2";
import { Ability } from "../types";
import { studiedTarget as stStatus } from "../../status-sheet2/status";


const displayName = 'Studied Target'
export const studiedTarget: Ability = {
    displayName,
    broadContexts: {},
    castType: 'free',
    handlers: {
        onUse: () => {
            return [{
                target: 'target',
                payload: stStatus
            }]
        }
    },
}

export default studiedTarget