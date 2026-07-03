const DEFAULT_STAT = 10

export const calculateBaseMod = (stat: number) => {
    if (stat <= 0) return -5

    const baseMod = stat - DEFAULT_STAT

    if (baseMod >= 0) return Math.floor(baseMod / 2)
    return Math.ceil(baseMod / 2)
}

export default calculateBaseMod