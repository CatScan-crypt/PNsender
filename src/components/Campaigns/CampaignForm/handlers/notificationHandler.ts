interface Token {
  token: string;
}

interface SendNotificationParams {
  title: string;
  body: string;
  selectedTokens: Token[];
  setSendResults: (results: string[]) => void;
  setIsSending: (isSending: boolean) => void;
}

export const handleSendNotification = async ({
  title,
  body,
  selectedTokens,
  setSendResults,
  setIsSending
}: SendNotificationParams) => {
  if (!title || !body || selectedTokens.length === 0) {
    setSendResults(["Please fill title, body, and select at least one token."]);
    return;
  }
  
  setIsSending(true);
  const results: string[] = [];
  
  try {
    for (const t of selectedTokens) {
      try {
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: t.token, title, body })
        });
        const data = await response.json();
        
        if (response.ok) {
          results.push(`✅ Token ${t.token.slice(0, 8)}...: Sent! Message ID: ${data.messageId || ''}`);
        } else {
          results.push(`❌ Token ${t.token.slice(0, 8)}...: Error: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        results.push(`❌ Token ${t.token.slice(0, 8)}...: Network error`);
      }
    }
  } finally {
    setIsSending(false);
  }
  
  setSendResults(results);
}; 