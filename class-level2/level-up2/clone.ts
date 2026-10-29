import { OwnerMaximal } from "../../actor2"

// shallow clone
// because the real cloner is in a different repo
export const testUtilCloneOwner = (owner: OwnerMaximal): OwnerMaximal => ({
    ...owner,
    cs: { ...owner.cs, levels: [...owner.cs.levels] },
    fs: { ...owner.fs },
    as: { ...owner.as },
})

export type OwnerWithClone = {
    original: OwnerMaximal,
    clone: OwnerMaximal,
}

export const _verifyOwnerIsClone = (data: {
    original: OwnerMaximal,
    clone: OwnerMaximal,
}) => {
    const { clone, original } = data
    if (
        original === clone
        || original.cs === clone.cs
        || original.as === clone.as
        || original.fs === clone.fs
    ) return false

    // .ss is okay for now (but potential timebomb)
    // everything else won't be modified by a level
    return true
}

export default _verifyOwnerIsClone
