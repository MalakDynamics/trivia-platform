export const buildMessage = (room, playerId, text) => {
    const player = room.players.get(playerId);
    if (!player) return null;
    return {
        id:     playerId,
        name:   player.name,
        text,
        msgId:  crypto.randomUUID(),
        ts:     Date.now()   
    }
}
