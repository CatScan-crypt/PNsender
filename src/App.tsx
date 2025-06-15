import SendTestNotification from './components/SendTestNotification';
import Campaigns from './components/Campaigns';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PNsender</h1>
          <nav>
            <Link to="/">Test Notification</Link> |{' '}
            <Link to="/campaigns">Campaigns</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <SendTestNotification />
              </>
            } />
            <Route path="/campaigns" element={
              <>
                <Campaigns />
              </>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
