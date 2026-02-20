const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

// Debug endpoint to see what we're receiving
app.get('/api/content/items/certificates', (req, res) => {
  console.log('\n=== REQUEST DEBUG ===');
  console.log('Full URL:', req.url);
  console.log('Query params:', req.query);
  console.log('filter[certienum]:', req.query['filter[certienum]']);
  console.log('filter:', req.query.filter);
  console.log('===================\n');
  
  res.json({ received: req.query });
});

app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
});
