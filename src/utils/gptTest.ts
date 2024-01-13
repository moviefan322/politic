export default async function testGPT() {
  const adjectiveList = [
    "still there",
    "awake",
    "still alive",
    "available",
    "still around",
    "still here",
    "still in business",
    "still in the game",
    "still in the picture",
    "still kicking",
    "still living",
    "still on deck",
    "still on hand",
    "still viable",
    "still with us",
    "still working",
  ];
  const adjective =
    adjectiveList[Math.floor(Math.random() * adjectiveList.length)];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Are you ${adjective}?` }],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
