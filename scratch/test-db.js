const { Client } = require('pg');

const connectionString = 'postgresql://postgres.mmjexlyuyqubbsreanvg:Adhil%402001%24@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err.message);
    process.exit(1);
  });
