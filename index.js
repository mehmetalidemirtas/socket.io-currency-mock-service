const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>FX32</h1>');
  res.end();
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
  "KRW",
  "RUB",
  "SEK",
  "NOK",
  "DKK",
  "UAH",
  "IDR",
];

function generateRandomValue() {
  return (Math.random() * (20 - 10) + 10).toFixed(2);
}
let previousSellValues = {
  USD: null,
  EUR: null,
  GBP: null,
  IDR: null,
  JPY: null,
  CHF: null,
  CHF: null,
  CAD: null,
  AUD: null,
  CNY: null,
  KRW: null,
  RUB: null,
  SEK: null,
  NOK: null,
  DKK: null,
  UAH: null,
};

io.on("connection", (socket) => {
  console.log("a user connected");
  const data = currencies
    .map((currency) => {
      const buyValue = generateRandomValue();
      const previousSellValue = 0;
      const sellValue = (parseFloat(buyValue) + Math.random() * 2).toFixed(2);
      previousSellValues[currency] = sellValue;
      const changeRate = 0;
      const backgroundColor = "#3E54AC";
      const time = Date.now();
      return `${currency}|${buyValue}|${sellValue}|${time}|${backgroundColor}|${changeRate}`;
    })
    .join(",");

  console.log("Sending data:", data);
  socket.emit("currency-update", data);

  const interval = setInterval(() => {
    const data = currencies
      .map((currency) => {
        const buyValue = generateRandomValue();
        const previousSellValue = previousSellValues[currency];
        const sellValue = (parseFloat(buyValue) + Math.random() * 2).toFixed(2);
        previousSellValues[currency] = sellValue;
        const changeRate = calculateChangeRate(previousSellValue, sellValue);
        const backgroundColor =
          previousSellValue === null
            ? "#3E54AC"
            : sellValue > previousSellValue
            ? "#7AA874"
            : sellValue < previousSellValue
            ? "#FF4F5A"
            : "#7AA874";
        const time = Date.now();
        return `${currency}|${buyValue}|${sellValue}|${time}|${backgroundColor}|${changeRate}`;
      })
      .join(",");

    console.log("Sending data:", data);
    socket.emit("currency-update", data);
  }, 10000);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    clearInterval(interval);
  });
});
function calculateChangeRate(previousValue, currentValue) {
  if (previousValue === null) {
    return 0;
  }
  const change = ((currentValue - previousValue) / previousValue) * 100;
  return parseFloat(change.toFixed(2));
}
server.listen(process.env.PORT || 80, () => {
  console.log("listening on :80");
});
