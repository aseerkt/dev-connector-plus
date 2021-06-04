import { createContext, useState } from 'react';

const MessageContext = createContext(null);
const DispatchContext = createContext(null);

const MessageProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
