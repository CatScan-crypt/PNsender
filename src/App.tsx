import { TokenTable } from './components/UserTable';
import SendNotificationForm from './components/SendNotificationForm';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PNsender</h1>
      </header>
      <main>
        <h2>Users</h2>
        <TokenTable />
      </main>
      <SendNotificationForm />
    </div>
  );
}

export default App;
