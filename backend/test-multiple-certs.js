const http = require('http');

const testCerts = ['AT0116936', 'AT0188783', 'AT0188700', 'INVALID123'];

function testCert(certNum) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/content/items/certificates?filter[certienum]=${certNum}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          console.log(`\nCert: ${certNum}`);
          console.log(`Results: ${results.length}`);
          if (results.length > 0) {
            console.log(`  Name: ${results[0].name}`);
            console.log(`  Course: ${results[0].coursename}`);
            console.log(`  Status: ${results[0].status ? 'Valid' : 'Invalid'}`);
          } else {
            console.log('  Not found');
          }
          resolve();
        } catch (e) {
          console.error('Error:', e.message);
          resolve();
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Error testing ${certNum}:`, e.message);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing multiple certificate searches...\n');
  for (const cert of testCerts) {
    await testCert(cert);
  }
  console.log('\nAll tests complete!');
}

runTests();
