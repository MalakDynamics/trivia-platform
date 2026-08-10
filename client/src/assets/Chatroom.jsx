import { useState, useEffect } from "react";
import { socket } from "../socket";

export default function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const handleMessage = (msg) => {
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
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
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