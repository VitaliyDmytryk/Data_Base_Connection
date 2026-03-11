import dotenv from 'dotenv'
dotenv.config()

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`
});

const initializeDatabase = async () => {
  console.log('🔄 Initializing database...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS gymhorror (
      id SERIAL PRIMARY KEY,
      exercise_name TEXT NOT NULL,
      chance_of_death TEXT NOT NULL,
      exercise_effect TEXT NOT NULL,
      difficult_level TEXT NOT NULL,
      additional_info TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log(' Database table initialized successfully');
 } catch (error) {
    console.error(' Error initializing database:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

initializeDatabase()

async function getData() {
   await pool.connect();
   const { rows } = await pool.query('SELECT * from gymhorror')
   console.log("Rows => ", rows);
   await pool.end()
}

async function addInfo(){
   await pool.query("insert into gymhorror (exercise_name, chance_of_death, exercise_effect, difficult_level, additional_info) values ('Bench press', '20%', 'low-effective', '3/10', 'Base chest exercise, but low effective')");
}

async function deleteRow() {
   await pool.query(`delete from gymhorror where id=2`)
}
deleteRow()
async function updateRow() {
   await pool.query(`update gymhorror set additional_info='barbos'`)
}
updateRow()

getData()
addInfo()
