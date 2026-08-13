import { useState, useEffect } from "react";
import { socket } from "../socket";
import { useChat } from "../hooks/useChat";

export default function Host() {
    const [phase, setPhase] = useState('intro')

    if (phase === 'intro') {
        return (
            <div>

            </div>
        )
    }

    if (phase === 'lobby') {
        return (
            <div>

            </div>
        )
    }
}