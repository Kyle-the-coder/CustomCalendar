import CalendarAdmin from "./CalendarAdmin";
import CalendarClient from "./CalendarClient";
import "./styles/main.css";
function App() {
  return (
    <div className="main-container">
      <h1>Admin Side</h1>
      <CalendarAdmin />
      <h1>Client Side</h1>
      <CalendarClient />
    </div>
  );
}

export default App;
