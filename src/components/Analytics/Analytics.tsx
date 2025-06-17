import './Analytics.css';
import { useEffect, useState } from 'react';
import { getAnalyticsData, deleteAnalyticsData } from './analyticsService';
import type { AnalyticsData } from './types';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalyticsData();
        setAnalyticsData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowSelect = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleDelete = async () => {
    try {
      // Delete each selected row from the backend
      await Promise.all(
        selectedRows.map(index => 
          deleteAnalyticsData(analyticsData[index].data_field.id)
        )
      );
      
      // Update the frontend state
      setAnalyticsData(prev => 
        prev.filter((_, index) => !selectedRows.includes(index))
      );
      setSelectedRows([]);
    } catch (err) {
      setError('Failed to delete selected rows');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="analytics-container">
      <h1>Analytics Page</h1>
      {selectedRows.length > 0 && (
        <button 
          onClick={handleDelete}
          className="delete-button"
        >
          Delete Selected ({selectedRows.length})
        </button>
      )}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Campaign</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Target</th>
            <th>Last updated</th>
            <th>Sends / Impressions</th>
            <th>Clicks / Opens</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData.map((data, index) => (
            <tr 
              key={index}
              className={selectedRows.includes(index) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleRowSelect(index)}
                />
              </td>
              <td>{data.data_field.id}</td>
              <td>{data.data_field.campaign}</td>
              <td>{data.data_field.start}</td>
              <td>{data.data_field.end}</td>
              <td>{data.data_field.status}</td>
              <td>{data.data_field.target}</td>
              <td>{data.data_field.last_updated}</td>
              <td>{data.data_field.sends_impressions}</td>
              <td>{data.data_field.clicks_opens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
