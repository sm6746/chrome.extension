// Background script for request queue and throttling
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.delayRange = { min: 300, max: 1000 };
  }

  async addRequest(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { request, resolve, reject } = this.queue.shift();
      
      try {
        // Add random delay to mimic human behavior
        const delay = this.getRandomDelay();
        await this.delay(delay);
        
        const result = await this.executeRequest(request);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }

  getRandomDelay() {
    const { min, max } = this.delayRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeRequest(request) {
    // Execute the actual request (scraping, API call, etc.)
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        } else {
          reject(new Error('No active tab found'));
        }
      });
    });
  }
}

class CacheManager {
  constructor() {
    this.ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  async get(key) {
    try {
      const result = await chrome.storage.local.get([key]);
      const data = result[key];
      
      if (!data) return null;
      
      // Check if data is expired
      if (Date.now() - data.timestamp > this.ttl) {
        await this.remove(key);
        return null;
      }
      
      return data.data;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  async set(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: this.ttl
      };
      
      await chrome.storage.local.set({ [key]: cacheData });
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async remove(key) {
    try {
      await chrome.storage.local.remove([key]);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  async clear() {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Initialize services
const requestQueue = new RequestQueue();
const cacheManager = new CacheManager();

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle the message asynchronously
  handleMessage(request, sender, sendResponse).catch(error => {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  });
  return true; // Keep message channel open for async response
});

async function handleMessage(request, sender, sendResponse) {
  try {
    switch (request.action) {
      case 'getConnections':
        await handleGetConnections(sendResponse);
        break;
      case 'clearCache':
        await handleClearCache(sendResponse);
        break;
      case 'scrapeConnections':
        await handleScrapeConnections(sendResponse);
        break;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetConnections(sendResponse) {
  try {
    // Check cache first
    const cachedConnections = await cacheManager.get('connections');
    
    if (cachedConnections) {
      sendResponse({
        success: true,
        connections: cachedConnections,
        fromCache: true
      });
      return;
    }
    
    // If not cached, trigger scraping
    await handleScrapeConnections(sendResponse);
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleScrapeConnections(sendResponse) {
  try {
    // Check if we're on LinkedIn
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]) {
        sendResponse({
          success: false,
          error: 'No active tab found'
        });
        return;
      }
      
      const activeTab = tabs[0];
      
      if (!activeTab.url.includes('linkedin.com')) {
        sendResponse({
          success: false,
          error: 'Please navigate to LinkedIn first'
        });
        return;
      }
      
      try {
        // Try to inject content script first
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        });
        
        // Wait a moment for the script to initialize
        setTimeout(() => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'scrapeConnections' }, (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                error: 'Content script failed to respond. Please refresh the LinkedIn page and try again.'
              });
            } else if (response && response.success) {
              // Cache the results
              cacheManager.set('connections', response.connections);
              sendResponse({
                success: true,
                connections: response.connections,
                fromCache: false
              });
            } else {
              sendResponse(response || { success: false, error: 'Unknown error occurred' });
            }
          });
        }, 1000);
        
      } catch (error) {
        sendResponse({
          success: false,
          error: 'Failed to inject content script. Please refresh the LinkedIn page.'
        });
      }
    });
    
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleClearCache(sendResponse) {
  try {
    await cacheManager.clear();
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('LinkedIn Connections Dashboard extension installed');
  }
});
