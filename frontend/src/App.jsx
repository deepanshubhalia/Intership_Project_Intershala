import { useState } from "react";
import EntryForm from "./components/EntryForm";
import Leaderboard from "./components/Leaderboard";
import Winner from "./components/Winner";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <EntryForm onEntryAdded={handleEntryAdded} />
      <Leaderboard refreshKey={refreshKey} />
      <Winner />
    </div>
  );
}

export default App;
