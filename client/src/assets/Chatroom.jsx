import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";

export default function Chatroom() {
    const colorsRef = useRef(new Map());
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const PALETTE = [
        '#c1272d', '#0f7b6c', '#2c5fd6', '#d1620a',
        '#7b2fbe', '#1a7a3c', '#b5177f', '#8a6d1f',
        '#0e6b8f', '#a03c1f', '#5b5bd6', '#6b7280',
    ];


    const assignColor = (id) => {
    if (!colorsRef.current.has(id)) {
        colorsRef.current.set(id, PALETTE[colorsRef.current.size % PALETTE.length]);
    }
    };

    useEffect(() => {
        const handleMessage = (msg) => {
            assignColor(msg.id); 
            setMessages((prev) => [...prev, msg])
        };

        socket.on('room:message', handleMessage);

        return () => {
            socket.off('room:message', handleMessage);
        };
    }, [])

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('room:message', text);
        setText('');
    }

    return (
        <div>
            <ul
                style={{
                    listStyle: 'none',
                    justifyItems: 'baseline',
                }}>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <span style={{ 
                                color: colorsRef.current.get(msg.id) ?? '#6b7280',
                                fontWeight: 'bold',
                             }}>
                            {msg.name}
                        </span>
                        : {msg.text}
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value = {text}
                    onChange = {(e) => setText(e.target.value)}/>
                <button
                    disabled={text.length === 0}>
                        Submit
                </button>
            </form>
        </div>
    )
}