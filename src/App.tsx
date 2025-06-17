import SendTestNotification from './components/SendTestNotification/SendTestNotification';
import Campaigns from './components/Campaigns/Campaigns';
import Analytics from './components/Analytics/Analytics';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1 className="header-title">PNsender</h1>
          <nav className="nav">
            <Link className="navLink" to="/">Test Notification</Link>
            <Link className="navLink" to="/campaigns">Campaigns</Link>
            <Link className="navLink" to="/analytics">Analytics</Link>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<SendTestNotification/>} />
            <Route path="/campaigns" element={<Campaigns/>} />
            <Route path="/analytics" element={<Analytics/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
