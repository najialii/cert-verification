const http = require('http');

// Test 1: With filter[certienum]
const options1 = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/content/items/certificates?filter[certienum]=Jakeer',
  method: 'GET'
};

console.log('Testing search for "Jakeer"...');
const req1 = http.request(options1, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const results = JSON.parse(data);
    console.log(`Found ${results.length} results`);
    if (results.length > 0 && results.length < 10) {
      results.forEach(r => console.log(`  - ${r.certienum}: ${r.name} - ${r.coursename}`));
    } else if (results.length > 0) {
      console.log(`  First result: ${results[0].certienum}: ${results[0].name}`);
    }
  });
});
req1.end();
