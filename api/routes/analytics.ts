import express, { Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';

const analyticsRouter = express.Router();

// MySQL Connection Pool (replace with your actual credentials)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123123123',
  database: 'analytics_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

analyticsRouter.post('/analytics', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data } = req.body;
    if (!data) {
      res.status(400).send('Data is required');
      return;
    }
    const [result] = await pool.execute(
      'INSERT INTO analyticsdata (data_field) VALUES (?)', 
      [JSON.stringify(data)]  // Make sure to stringify the data
    );
    const resultSetHeader = result as ResultSetHeader;
    res.status(201).json({ 
      message: 'Data saved successfully', 
      id: resultSetHeader.insertId,
      data 
    });
  } catch (error) {
    console.error('Error saving analytics data:', error);
    res.status(500).send('Failed to save analytics data');
  }
});
analyticsRouter.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT id, data_field FROM analyticsdata');
    const formattedRows = (rows as any[]).map(row => ({
      id: row.id,
      data_field: {
        ...row.data_field,  // data_field is already an object, no need to parse
         // Also include ID in the data_field
      }
    }));
    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).send('Failed to fetch analytics data');
  }
});

analyticsRouter.patch('/analytics', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, ...updates } = req.body;
      
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }
      
      // Build the JSON_SET string dynamically based on provided fields
      const setClause = Object.entries(updates)
        .map(([key, value]) => `'$.${key}', '${value}'`)
        .join(', ');
      
      const query = `
        UPDATE analyticsdata 
        SET data_field = JSON_SET(data_field, ${setClause})
        WHERE data_field->'$.id' = ?
      `;
      
      const [result] = await pool.execute(query, [id]);
      const resultSetHeader = result as ResultSetHeader;
      
      if (resultSetHeader.affectedRows === 0) {
        res.status(404).json({ message: 'Record not found' });
        return;
      }
      
      res.status(200).json({ message: 'Update successful' });
    } catch (error) {
      console.error('Error updating analytics data:', error);
      res.status(500).send('Failed to update analytics data');
    }
  });

analyticsRouter.delete('/analytics', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.body;
      
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }
      
      const query = `
        DELETE FROM analyticsdata 
        WHERE data_field->'$.id' = ?
      `;
      
      const [result] = await pool.execute(query, [id]);
      const resultSetHeader = result as ResultSetHeader;
      
      if (resultSetHeader.affectedRows === 0) {
        res.status(404).json({ message: 'Record not found' });
        return;
      }
      
      res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting analytics data:', error);
      res.status(500).send('Failed to delete analytics data');
    }
  });

export default analyticsRouter; 



