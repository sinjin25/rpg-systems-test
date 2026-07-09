export type BoxPlotStats = {
    min: number,
    q1: number,
    median: number,
    q3: number,
    max: number,
    mean: number,
}

// linear interpolation between closest ranks, same convention as numpy's default
const quantile = (sorted: number[], p: number): number => {
    const idx = (sorted.length - 1) * p
    const lower = Math.floor(idx)
    const upper = Math.ceil(idx)
    if (lower === upper) return sorted[lower]
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower)
}

export const boxPlotStats = (values: number[]): BoxPlotStats => {
    if (values.length === 0) throw new Error('boxPlotStats requires at least one value')
    const sorted = [...values].sort((a, b) => a - b)

    return {
        min: sorted[0],
        q1: quantile(sorted, 0.25),
        median: quantile(sorted, 0.5),
        q3: quantile(sorted, 0.75),
        max: sorted[sorted.length - 1],
        mean: sorted.reduce((sum, v) => sum + v, 0) / sorted.length,
    }
}
