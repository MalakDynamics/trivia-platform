import { useState, useEffect } from "react";
import { socket } from "../socket";
import { useChat } from "../hooks/useChat";
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function Board() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [phase, setPhase] = useState(roomCode ? 'lobby' : 'intro')
    const [ gameCode, setGameCode ] = useState(null)


    useEffect(()=>{
        const handleRoomCreated = (roomCode) => {
            setPhase('lobby');
            setGameCode(roomCode)
            navigate(`/board/${roomCode}`)
        };

        socket.on('room:created', handleRoomCreated)

        return () => {
            socket.off('room:created', handleRoomCreated);
        }
    },[])

    const handleRoomCreate = (e) => {
        e.preventDefault();
        socket.emit('room:create');
    };

    if (phase === 'intro') {
        return (
            <div>
                <h1>Host Game Board</h1>
                <form onSubmit={handleRoomCreate}>
                    <button>Start Game</button>
                </form>
            </div>
        )
    }

    if (phase === 'lobby') {
        return (
            <div>
                <h1>Game Code Is: {gameCode}</h1>
                <QRCodeSVG value={`http://192.168.50.32:5173/player/${roomCode}`} size={256} />
            </div>
        )
    }
}