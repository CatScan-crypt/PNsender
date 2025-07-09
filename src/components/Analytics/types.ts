export interface AnalyticsData {
  id: string;
  data_field: {
    campaign: string;
    start: string;
    end: string;
    status: string;
    target: string;
    last_updated: string; 
    sends_impressions: string;
    clicks_opens: string;
  };
} 