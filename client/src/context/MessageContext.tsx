import { createContext, useContext, useState } from 'react';

const MessageContext = createContext(null);

const MessageProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMsgContext = () => useContext(MessageContext);
