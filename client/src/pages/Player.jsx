import { useState, useEffect } from "react";
import { socket } from "../socket";
import Chatroom from "../assets/Chatroom";

export default function Player() {
    const [phase, setPhase] = useState("join"); // what stp the client is in
    const [codeInput, setCodeInput] = useState(""); // the 4-char code field
    const [name, setName] = useState(""); // username

    useEffect(() => {
        const handleRoomJoined = ([success, roomCode]) => {
            if (success) {
                setPhase("chooseUsername")
            }
        }
        
        socket.on('room:joined', handleRoomJoined)
        
    }, [])
    const handleRoomSubmit = (e) => {
        e.preventDefault();
        console.log(socket.connected);
        
        console.log('handleroom triggered');
        if (codeInput.length === 4) {
                const roomCode = codeInput.toUpperCase()
                socket.emit('room:join', roomCode)
            }
    }

    const handleNameSubmit = (e) => {
        e.preventDefault();
        console.log('handlename triggered');
        
        if (!!name) {
            socket.emit('player:set-name', name)
        }
        setPhase("lobby");
    }
    
    // input code room
    if (phase === "join") {
        return (
            <div>
                <h1>Enter Room Code:</h1>
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


    // after code is entered, add username
    if (phase === "chooseUsername") {
        return (
            <div>
                <h1>Choose a Username</h1>
                <form onSubmit={handleNameSubmit}>
                    <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                    <button
                    disabled={name.length === 0}>
                        Submit Username
                    </button>
                </form>
            </div>
        )
    }

    // after username added, wait for game to start
    if (phase === "lobby")
        return (
            <div>
                <h1>Player Lobby</h1>
                <Chatroom />
            </div>
        )

    return <div>unknown phase</div>
}