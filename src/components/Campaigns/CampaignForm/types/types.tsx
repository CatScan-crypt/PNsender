export interface CampaignFormProps {
    title: string;
    setTitle: (title: string) => void;
    message: string;
    setMessage: (message: string) => void;
    image: string;
    setImage: (url: string) => void;
    selectedTokens: any[];
    sendResults: string[];
    isSending: boolean;
    setSendResults: (results: string[]) => void;
    setIsSending: (isSending: boolean) => void;
  }