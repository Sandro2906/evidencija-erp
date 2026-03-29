const { Client } = require('pg');
const fs = require('fs');

async function initDB() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_Z8zanBvpJ2MO@ep-snowy-smoke-agt4oi8l-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  });

  try {
    await client.connect();
    console.log("Konektovano na bazu...");
    
    const schema = fs.readFileSync('sql/schema.sql', 'utf8');
    await client.query(schema);
    console.log("Tabele uspesno kreirane!");
    
  } catch (error) {
    console.error("Greska:", error);
  } finally {
    await client.end();
  }
}

initDB();
