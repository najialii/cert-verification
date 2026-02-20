const http = require('http');

// Test exact certificate number search
const testCertNum = 'AT0116936';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: `/api/content/items/certificates?filter[certienum]=${testCertNum}`,
  method: 'GET'
};

console.log(`Testing API endpoint for certificate: ${testCertNum}`);
console.log(`URL: http://localhost:3001${options.path}\n`);

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const results = JSON.parse(data);
      console.log(`Response Status: ${res.statusCode}`);
      console.log(`Found ${results.length} results\n`);
      
      if (results.length > 0) {
        results.forEach((r, index) => {
          console.log(`Result ${index + 1}:`);
          console.log(`  ID: ${r._id}`);
          console.log(`  Certificate: ${r.certienum}`);
          console.log(`  Name: ${r.name}`);
          console.log(`  Course: ${r.coursename}`);
          console.log(`  Expiry: ${r.expairydate}`);
          console.log(`  Status: ${r.status}`);
          console.log('');
        });
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
  console.log('Make sure the backend server is running on port 3001');
});

req.end();
