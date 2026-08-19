import { OwnerMaximal } from "../../actor2";
import newModNode, { sumFunc } from "../../log2";
import roll from "../../log2/roll";
import save from "../../log2/terminal/save";
import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecaySaveSucceededLog, StatusExpiration, StatusExpirationSaveSucceeded } from "./types";

export const statusExpirationIsSaveSucceeded = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationSaveSucceeded =>
    expiration?.kind === 'save-succeeded'

export const decaySaveSucceeded = (owner: OwnerMaximal): DecaySaveSucceededLog[] => {
    const log: DecaySaveSucceededLog[] = []

    for (const key of Object.keys(owner.ss)) {
        for (const inst of [...owner.ss[key]!]) {
            if (!statusExpirationIsSaveSucceeded(inst.expiration)) continue

            const { saveType, dc } = inst.expiration
            const saveMod = save(saveType)(owner)
            const natural = roll(20, 1)(owner)
            const saveTotal = newModNode('save', [saveMod, natural], sumFunc)

            let pass: boolean
            if (natural.total() === 1) pass = false
            else if (natural.total() === 20) pass = true
            else if (saveTotal.total() < dc.total()) pass = false
            else pass = true
            log.push({
                key,
                kind: pass ? 'succeeded' : 'failed',
                dc,
                save: saveTotal,
            })
            if (pass) chainStatus(owner, expireStatus(owner, key, inst))
        }
    }

    return log
}
