import './App.css'
import  Player  from './pages/Player'

function App() {
  const isHost = window.location.search.includes("host")
  return isHost ? <Host /> : <Player />;
}

export default App
