import './App.css'
import  Player  from './pages/Player'
import Board from './pages/Board'
import { Routes, Route } from 'react-router-dom'

function App() {
/*
  DOWN THE LINE, THIS FUNCTION WILL BE USED TO KEEP
  PLAYERS CONNECTED TO A GAME ON REFRESH.
  NEED TO BUILD LOGIC IN SERVER.JS TO RECONNECT PLAYER:

  function getPlayerId() {
    let id = sessionStorage.getItem('playerId');
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('playerId', id);
    }
    return id;
  }
*/
  return (
    <Routes>
      <Route path="/board" element={<Board />} />
      <Route path="/board/:roomCode" element={<Board />} />
      {/* <Route path="/host/:roomCode" element={<Host />} /> */}
      <Route path="/player" element={<Player />} />
      <Route path="/player/:roomCode" element={<Player />} />
    </Routes>
  )
}

export default App
