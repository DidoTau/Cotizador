import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/:date/convertFromClp', async (req, res) => {
  const date = req.params.date;
  const to = req.query.to as string;
  const amount = Number(req.query.amount);

  axios.get(`https://${date}.currency-api.pages.dev/v1/currencies/clp.json`)
    .then((response) => {
      const data = response.data["clp"];
      const conversion = data[to];
      const converted = (amount * conversion) * 0.95;
      res.json({ amount: converted.toFixed(2), exchangeRate: (amount/converted).toFixed(2) });
    })
    .catch((error) => {
      console.error(error)
      res.status(404).json({ error: 'Conversion not found' });
    });

});

app.get('/:date/convertToClp', (req, res) => {
  const date = req.params.date;
  const from = req.query.from as string;
  const amount = Number(req.query.amount);

  axios.get(`https://${date}.currency-api.pages.dev/v1/currencies/${from}.json`)
    .then((response) => {
      const data = response.data[from];
      const conversion = data["clp"];
      const converted = (amount * conversion) * 0.95;
      res.json({ amount: converted.toFixed(2), exchangeRate: (amount/converted).toFixed(2) });
    })
    .catch((error) => {
      res.status(404).json({ error: 'Conversion not found' });
    });
});


export default app;