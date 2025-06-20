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

export const handlePostCampaignAnalytics = async (title: string = "Test POST", selectedTokens: any[] = []): Promise<void> => {
  try {
    const now = new Date().toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
      .slice(0, -3);
    const analyticsData: CampaignAnalytics = {
      data: {
        campaign: title,
        start: now,
        end: "-",
        status: "Active",
        target: "Test Users",
        last_updated: now,
        sends_impressions: `${selectedTokens.length} / 0`,
        clicks_opens: "0 / 0"
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