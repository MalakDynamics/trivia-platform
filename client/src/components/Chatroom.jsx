import { useState } from "react";

const PALETTE = [
    '#c1272d', '#0f7b6c', '#2c5fd6', '#d1620a',
    '#7b2fbe', '#1a7a3c', '#b5177f', '#8a6d1f',
    '#0e6b8f', '#a03c1f', '#5b5bd6', '#6b7280',
];

export default function Chatroom({ messages, onSend }) {
    const [text, setText] = useState('');

    const colorFor = (id) => {
        let h = 0;
        for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
        return PALETTE[Math.abs(h) % PALETTE.length];
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(text);
        setText('');
    };
    return (
        <div>
            <ul
                style={{
                    listStyle: 'none',
                    justifyItems: 'baseline',
                }}>
                {messages.map((msg) => (
                    <li key={msg.msgId}>
                        <span style={{ 
                                color: colorFor(msg.id) ?? '#6b7280',
                                fontWeight: 'bold',
                             }}>
                            {msg.name}
                        </span>
                        : {msg.text}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
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