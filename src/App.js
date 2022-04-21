import logo from "./logo.svg";
import "./App.css";
import Header from "./Components/Header";
import Staking from "./Pages/Staking";

function App() {
  return (
    <div className="App bg-gray-900 flex flex-col">
      <Header />
      {Staking()}
    </div>
  );
}

export default App;
