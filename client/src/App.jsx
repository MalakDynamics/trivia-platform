import './App.css'

function App() {
  const isHost = window.location.search.includes("host")
  return isHost ? <Host /> : <Player />;
}

export default App
