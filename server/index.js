require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/test", async (req, res) => {
  try {
    const { data, error } = await supabase.from("charities").select("*");

    if (error) return res.json(error);

    res.json(data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/add-entry", async (req, res) => {
  try {
    const { email, charity_id } = req.body;

    if (!email || !charity_id) {
      return res.status(400).json({ error: "Email and charity_id required" });
    }

    // check user
    let { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError && userError.code !== "PGRST116") {
      return res.status(500).json({ error: userError.message });
    }

    // create user if not exists
    if (!user) {
      const { data: newUser, error: newUserError } = await supabase
        .from("users")
        .insert([{ email, score: 0 }])
        .select()
        .single();

      if (newUserError) {
        return res.status(500).json({ error: newUserError.message });
      }

      user = newUser;
    }

    // count entries
    const { count, error: countError } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .eq("user_email", email);

    if (countError) {
      return res.status(500).json({ error: countError.message });
    }

    if ((count || 0) >= 5) {
      return res.status(400).json({ error: "Max 5 entries allowed" });
    }

    // insert entry
    const { error: entryInsertError } = await supabase
      .from("entries")
      .insert([{ user_email: email, charity_id }]);

    if (entryInsertError) {
      return res.status(500).json({ error: entryInsertError.message });
    }

    // update score
    const { error: scoreUpdateError } = await supabase
      .from("users")
      .update({ score: user.score + 1 })
      .eq("email", email);

    if (scoreUpdateError) {
      return res.status(500).json({ error: scoreUpdateError.message });
    }

    res.json({ message: "Entry added successfully 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email, score")
      .order("score", { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/winner", async (req, res) => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw error;

    const eligibleUsers = (users || []).filter((user) => Number(user.score) > 0);

    if (eligibleUsers.length === 0) {
      return res.status(400).json({ error: "No eligible users with score > 0" });
    }

    const totalScore = eligibleUsers.reduce(
      (sum, user) => sum + Number(user.score),
      0
    );

    let randomPoint = Math.random() * totalScore;
    let winner = eligibleUsers[0];

    for (const user of eligibleUsers) {
      randomPoint -= Number(user.score);
      if (randomPoint <= 0) {
        winner = user;
        break;
      }
    }

    res.json({
      winner,
      method: "weighted_random_by_score",
      note: "Winner probability is proportional to user score.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});