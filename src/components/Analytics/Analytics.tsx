import './Analytics.css';
import analyticsData from './analyticsData.json';

function Analytics() {
  return (
    <div className="analytics-container">
      <h1>Analytics Page</h1>
      <table>
        <thead>
          <tr>
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
            <tr key={index}>
              <td>{data.campaign}</td>
              <td>{data.start}</td>
              <td>{data.end}</td>
              <td>{data.status}</td>
              <td>{data.target}</td>
              <td>{data.last_updated}</td>
              <td>{data.sends_impressions}</td>
              <td>{data.clicks_opens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
