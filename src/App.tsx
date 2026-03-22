import { ReportForm } from './components/ReportForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Peripheral Blood Smear Report Generator</h1>
      </header>
      <main>
        <ReportForm />
      </main>
    </div>
  )
}

export default App
