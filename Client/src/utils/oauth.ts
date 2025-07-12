export const initiateOAuthLogin = (provider: 'google' | 'github') => {
  // For OAuth popups, we need the full server URL, not the proxy
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  const authUrl = `${serverUrl}/api/auth/${provider}`;
  
  console.log('OAuth URL:', authUrl); // Debug log
  
  // Create popup window
  const popup = window.open(
    authUrl,
    `${provider}_oauth`,
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );

  return new Promise<string>((resolve, reject) => {
    let checkClosed: ReturnType<typeof setInterval>;
    
    // Listen for message from popup
    const messageListener = (event: MessageEvent) => {
      console.log('=== OAUTH MESSAGE DEBUG ===');
      console.log('Received message:', event.data);
      console.log('From origin:', event.origin);
      console.log('Event type:', typeof event.data);
      console.log('Message type:', event.data?.type);
      console.log('Has token:', !!event.data?.token);
      console.log('Token value:', event.data?.token);
      console.log('=== END DEBUG ===');
      
      // Allow messages from localhost (both server and client ports) or any origin for OAuth
      const isValidOrigin = event.origin.includes('localhost') || 
                           event.origin.includes('127.0.0.1') ||
                           event.origin === 'null' || // For file:// protocol
                           event.data?.type === 'OAUTH_SUCCESS'; // If it's our expected message type
      
      if (!isValidOrigin) {
        console.log('Message from unexpected origin:', event.origin);
        return;
      }
      
      if (event.data && event.data.type === 'OAUTH_SUCCESS' && event.data.token) {
        console.log('✅ OAuth success message received, token:', !!event.data.token);
        window.removeEventListener('message', messageListener);
        clearInterval(checkClosed);
        popup?.close();
        resolve(event.data.token);
      } else {
        console.log('❌ Message received but not OAuth success or missing token');
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup was closed manually
    checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        reject(new Error('OAuth popup was closed'));
      }
    }, 1000);

    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', messageListener);
      popup?.close();
      reject(new Error('OAuth timeout'));
    }, 5 * 60 * 1000);
  });
};
