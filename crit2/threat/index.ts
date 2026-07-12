/* 
A natural roll within the weapons threat range (ex: 18-20) or a nat 20 is called a "threat" This is only the case if it hits
A threat is eligible to be "confirmed"
*/
export const isThreat = (naturalRoll: number, threatRange: number): boolean => {
    return naturalRoll >= threatRange
}

export default isThreat