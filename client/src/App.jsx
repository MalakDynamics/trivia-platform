import './App.css'
import  Player  from './pages/Player'

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
  const isHost = window.location.search.includes("host")
  return isHost ? <Host /> : <Player />;
}

export default App
