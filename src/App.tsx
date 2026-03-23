import { SessionManager } from './components/SessionManager'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Peripheral Blood Report Generator</h1>
      </header>
      <main>
        <SessionManager />
      </main>
    </div>
  )
}

export default App
