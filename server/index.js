const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Backend is working! Use /stock/:name to get news.");
});

app.get("/stock/:name", async (req, res) => {
  const stockName = req.params.name;
  const url = `https://www.moneycontrol.com/news/tags/${stockName.toLowerCase()}.html`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsList = [];

    $(".clearfix").each((i, el) => {
      const title = $(el).find("h2").text().trim();
      const link = $(el).find("a").attr("href");

      if (title && link && link.startsWith("https://")) {
        newsList.push({ title, link });
      }
    });

    res.json({ stock: stockName, news: newsList.slice(0, 5) });
  } catch (err) {
    console.error("❌ Scraping Error:", err.message);
    res.status(500).json({ error: "News fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
