import type { AnalyticsData } from './types';

const API_URL = 'http://localhost:3001/api';

export const getAnalyticsData = async (): Promise<AnalyticsData[]> => {
  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }
  return response.json();
};

export const deleteAnalyticsData = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/analytics`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete analytics data');
  }
}; 