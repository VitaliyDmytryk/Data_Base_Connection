import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`,
   ssl: {
      rejectUnauthorized: false
   }
});
const initializeDatabase = async () => {
   console.log('Initializing data database...');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS gym (
    id SERIAL PRIMARY KEY,
    exercise_name TEXT NOT NULL,      
    difficult_level TEXT NOT NULL,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
   `;

   try {
      const client = await pool.connect();
      await pool.query(createTableQuery);
      console.log('---The server is ready to go.---');
   } catch (error) {
      console.error('Error initializing database:', error.message);
      console.error('Full error:', error);
      throw error;
   }
};
await initializeDatabase();

async function addExercise(exercise_name, difficult_level) {
    const query = `
        INSERT INTO gym (
            exercise_name,
            difficult_level
        ) 
        VALUES ($1, $2) 
        RETURNING *`;

    const values = [exercise_name, difficult_level];
   
    try {
       const res = await pool.query(query, values);
       console.log('Exercise added:', res.rows[0]);
    } catch (err) {
        console.error('Error:', err.message);
    }
}


async function allExercises() {
    const res = await pool.query('SELECT * FROM gym');
    
    console.table(res.rows)
    return res.rows
}


async function deleteExercise(id) {
    const query = `
        DELETE FROM gym 
        WHERE id = $1
        RETURNING *`;
    const values = [id];

     try {
    const res = await pool.query(query, values);
    
    if (res.rows.length > 0) {
        console.log(`Exercise with id:${id} deleted:`, res.rows[0]);
    } else {
        console.log(`Exercise with id:${id} not found`);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}




(async () => {
   try {

      switch(process.argv[2]) { 
        
        case 'list': {
            await allExercises();
            break;
        } 

        case 'add': {
            await addExercise(process.argv[3], process.argv[4]);
            break;
        }
        
        case 'delete': {
            const id = parseInt(process.argv[3]);
            await deleteExercise(id);
            break;
        }
        
        case "help": {
            console.log("All comands:");
            console.log("node db.js list - show all Exercises");
            console.log("node db.js add (exercise_name) (difficult_level)");
            console.log("node db.js delete (id)");
            break;
        }
      }

   }


    catch (err) {
      console.error("Error:", err.message);
   } finally {
      console.log('---The database has finished working.---');
}
})();
