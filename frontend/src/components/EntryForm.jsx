import { useState } from "react";
import axios from "axios";

export default function EntryForm({ onEntryAdded }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://intership-project-intershala.onrender.com/add-entry", {
        email,
        charity_id: "11111111-1111-1111-1111-111111111111",
      });

      if (onEntryAdded) {
        onEntryAdded();
      }

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80">
      <h2 className="text-xl font-bold mb-4">Enter Giveaway 🎁</h2>

      <input
        type="email"
        placeholder="Enter email"
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Submit
      </button>
    </div>
  );
}
