const { app } = require('./index');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Detection Results API listening: http://localhost:${PORT}`);
});