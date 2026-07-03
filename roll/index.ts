const roll = (
    diceSides: number,
) => {
    return Math.floor(Math.random() * diceSides) + 1
}

export default roll