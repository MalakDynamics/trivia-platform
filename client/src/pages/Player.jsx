import { useState, useEffect } from "react";
import { socket } from "../socket";

export default function Player() {
    const [phase, setPhase] = useState("join"); // what stp the client is in
    const [codeInput, setCodeInput] = useState(""); // the 4-char code field
    const [name, setName] = useState(""); // username


    const handleRoomSubmit = (e) => {
        e.preventDefault();
        if (codeInput.length === 4) {
                const roomCode = codeInput.toUpperCase()
                socket.emit('room:join', roomCode)
            }
    }

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            socket.emit('player:set-name', name)
        }
    }

    // input code room
    if (phase === "join") {
        return (
            <div>
                <form onSubmit={handleRoomSubmit}> 
                    <input 
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    maxLength={4}
                    />
                    <button
                    disabled={codeInput.length !== 4}
                    >
                        Join Room
                    </button>
                </form>
            </div>
        )
    }


    // waiting room once code is entered
    if (phase === "lobby") {
        return (
            <div>
                <form onSubmit={handleNameSubmit}>
                    <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                    <button
                    disabled={name.length === 0}>
                        Submit
                    </button>
                </form>
            </div>
        )
    }

    /*
    Phases I need to build:
    game board
    question board

    */

    return <div>unknown phase</div>
}