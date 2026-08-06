import { OwnerMaximal } from "../../actor2"
import { StatusEffect } from "../../status-sheet2"
import burningWeaponStatus from "../../status-sheet2/status/burning-weapon"
import { Ability, SnapshotAbility } from "../types"
import { ignite as igniteStatus } from '../../status-sheet2/status'
import { leaf } from "../../log2"

const displayName = 'ignite'
const ignite: SnapshotAbility = (owner: OwnerMaximal) => {
    return {
        displayName,
        broadContexts: {},
        castType: 'standard',
        handlers: {
            onUse: () => {
                return [{
                    target: 'target',
                    payload: leaf('ignite', 3)
                }]
            },
            onFailedSave: () => {
                return [{
                    target: 'target',
                    payload: igniteStatus({
                        snapshot: owner
                    })
                }]
            },
        },
        dc: {
            baseDc: 10,
            saveType: 'reflex',
            tags: ['fire', 'magic']
        }
    }
}

export default ignite