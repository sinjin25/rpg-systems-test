import { Actor2 } from "../actor2";

export default (participants: {
    playerTeam: Actor2[],
    enemyTeam: Actor2[],
}, team: 'enemy' | 'player' | 'any' = 'enemy') => {
    switch (team) {
        case 'any': return [...participants.playerTeam, ...participants.enemyTeam]
        case 'player': return participants.playerTeam
        case 'enemy':
        default:
            return participants.enemyTeam
    }
}