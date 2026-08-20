import { useState, useEffect } from "react";
import { socket } from "../socket";
import { useChat } from "../hooks/useChat";
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Chatroom from "../components/Chatroom";

export default function Board() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const { messages, send } = useChat();
    const [phase, setPhase] = useState(roomCode ? 'joining' : 'join')
    const [ gameCode, setGameCode ] = useState(null)
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        if (phase !== 'joining') return;
        const intervalId = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [phase]);

    useEffect(()=>{
        if (roomCode) {
            socket.emit('room:join', roomCode.toUpperCase());
        }
        
        
    },[])
    const handleRoomCreated = (roomCode) => {
        setPhase('lobby');
        setGameCode(roomCode)
        navigate(`/board/${roomCode}`)
    };

    const startGame = (e) => {
        e.preventDefault();
        socket.emit('start:game', (response) => {
            if (response.ok) {
                setPhase('buzzer'); //CHANGE LATER, WE JUST NEED TO GET THIS PART GOING
            } else {
                return
            }
        })
    };

    const handleRoomCreate = (e) => {
        e.preventDefault();
        socket.emit('room:create', (response) => {
            if (response.ok) {
                handleRoomCreated(response.code)
            } else {
                return
            }
        })
    };

    const handleRoomJoinAttempt = (code) => {
        socket.emit('room:join', code.toUpperCase(), 'board', (response) => {
            if (response.ok) {
                setGameCode(code);
                setPhase('lobby');
            } else {
                return
            }
        })
    }


    if (phase === 'join') {
        return (
            <div>
                <h1>Host Game Board</h1>
                <form onSubmit={handleRoomCreate}>
                    <button>Start Game</button>
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

    if (phase === 'lobby') {
        return (
            <div>
                <h1>Game Code Is: {gameCode}</h1>
                <QRCodeSVG value={`http://192.168.50.32:5173/player/${gameCode}`} size={256} />
                <Chatroom messages={messages} onSend={send} />
                <form onSubmit={startGame}>
                    <button>Start Game</button>
                </form>
            </div>
        )
    }

    
}