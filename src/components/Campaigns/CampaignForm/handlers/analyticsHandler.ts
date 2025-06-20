interface CampaignAnalytics {
  data: {
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

export const handlePostCampaignAnalytics = async (title: string = "Test POST"): Promise<void> => {
  try {
    const now = new Date().toISOString();
    const analyticsData: CampaignAnalytics = {
      data: {
        campaign: title,
        start: now,
        end: "-",
        status: "Active",
        target: "Test Users",
        last_updated: now,
        sends_impressions: "100 / 95",
        clicks_opens: "50 / 100"
      }
    };

    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analyticsData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Campaign analytics posted successfully:', data);
  } catch (error) {
    console.error('Error posting campaign analytics:', error);
    throw error;
  }
}; 