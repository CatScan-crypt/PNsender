import UserTable from './components/UserTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Redis User Data</h1>
      </header>
      <main>
        <UserTable />
      </main>
    </div>
  );
}

export default App;
