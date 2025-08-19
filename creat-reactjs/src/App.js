import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Thông tin sinh viên */}
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <p><strong>Tên sinh viên:</strong> Phan Duy Kiệt</p>
          <p><strong>MSSV:</strong> 22110360</p>
        </div>
      </header>
    </div>
  );
}

export default App;
