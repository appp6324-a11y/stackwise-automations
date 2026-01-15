import { useState, useEffect } from 'react';

const SESSION_KEY = 'sachidax_session_id';

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let storedSessionId = localStorage.getItem(SESSION_KEY);
    
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, storedSessionId);
    }
    
    setSessionId(storedSessionId);
  }, []);

  const clearSession = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  };

  return { sessionId, clearSession };
}
