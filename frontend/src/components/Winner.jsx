import { useState } from "react";
import axios from "axios";

export default function Winner() {
  const [winner, setWinner] = useState(null);

  const getWinner = async () => {
    const res = await axios.get("http://localhost:5000/winner");
    setWinner(res.data.winner);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 mt-4 text-center">
      <h2 className="text-xl font-bold mb-4">Pick Winner 🎯</h2>

      <button
        onClick={getWinner}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Pick Winner
      </button>

      {winner && (
        <div className="mt-4">
          <p className="font-bold">{winner.email}</p>
          <p>Score: {winner.score}</p>
        </div>
      )}
    </div>
  );
}
