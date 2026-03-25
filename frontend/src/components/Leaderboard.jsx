import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard({ refreshKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/leaderboard").then((res) => setData(res.data));
  }, [refreshKey]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 mt-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard 🏆</h2>

      {data.map((user, i) => (
        <div key={i} className="flex justify-between border-b py-2">
          <span>{user.email}</span>
          <span>{user.score}</span>
        </div>
      ))}
    </div>
  );
}
