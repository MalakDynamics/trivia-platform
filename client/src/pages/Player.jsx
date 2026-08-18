// need to add joining view, prevent player:set-name from crashing system
// If chooseUserame and send to false room the whole server will crash
import { useState, useEffect } from "react";
import { socket } from "../socket";
import Chatroom from "../components/Chatroom";
import { useChat } from "../hooks/useChat";
import { useParams, useNavigate } from 'react-router-dom';

export default function Player() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [phase, setPhase] = useState(roomCode ? "joining" : "join"); // what step the client is in
    const { messages, send } = useChat();
    const [codeInput, setCodeInput] = useState(""); // the 4-char code field
    const [joinError, setJoinError] = useState(null);
    const [name, setName] = useState(""); // username
    const [userList, setUserList] = useState([]);
    const [dotCount, setDotCount] = useState(0);

    
    useEffect(() => {
        if (phase !== 'joining') return;
        const intervalId = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [phase]);

    useEffect(() => {
        if (roomCode) {
            attemptJoin(roomCode.toUpperCase());
        }

        const handleUserJoin = (users) => {
            console.log([...users]);
            if (users) {
                setUserList(users);
            }
            
        }

        socket.on('room:playerList', handleUserJoin);


        return () => {
            socket.off('room:playerList', handleUserJoin);
        }
        
    }, [])

    const attemptJoin = (code) => {
        socket.emit('room:join', code, 'player', (response) => {
            if (response.ok) {
                setPhase('chooseUsername');
                navigate(`/player/${code}`);
            } else {
                setJoinError(response.error)
            }
        })
    }

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        console.log(socket.connected);
        
        console.log('handleroom triggered');
        if (codeInput.length === 4) {
            attemptJoin(codeInput);
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
                    onChange={(e) => {
                        setCodeInput(e.target.value.toUpperCase());
                        setJoinError(null)}}
                    maxLength={4}
                    />
                    <button
                    disabled={codeInput.length !== 4}
                    >
                        Join Room
                    </button>
                    <p 
                        style={{
                            display: joinError ? 'block' : 'none',
                            color: 'red',
                        }}>Invalid Code entered</p>
                </form>
            </div>
        )
    }



    if (phase === 'joining') {
        return (
            <div>
                <h1>Joining{'.'.repeat(dotCount)}</h1>
            </div>
        );
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
                    maxLength={20}
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
                <Chatroom messages={messages} onSend={send} />
                <div>
                    <h3>players:</h3>
                    <ul>
                        {userList.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )

    return <div>unknown phase</div>
}