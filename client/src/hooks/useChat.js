import { useState, useEffect } from "react";
import { socket } from "../socket";

export function useChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("room:message", handleMessage);
    return () => socket.off("room:message", handleMessage);
  }, []);

  const send = (text) => socket.emit("room:message", text);

  return { messages, send };
}