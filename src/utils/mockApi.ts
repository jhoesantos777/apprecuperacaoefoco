
import { fetchMockTalkToMeApi } from './mockTalkToMe';

// Mock fetch function that intercepts certain API calls
export const setupMockApi = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    const url = input.toString();
    
    // Handle mock API endpoints
    if (url === '/api/talk-to-me') {
      const body = init?.body ? JSON.parse(init.body.toString()) : {};
      return fetchMockTalkToMeApi(body.messages, body.mood);
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };
};
