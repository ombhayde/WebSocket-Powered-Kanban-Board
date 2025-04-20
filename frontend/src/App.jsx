import React from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <div className="App">
      <h1 style={{ fontFamily: "'Arial', sans-serif", textAlign: "center" }}>
  Real-time Kanban Board
</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
