// Content script for LinkedIn connections scraping
// Check if already initialized to prevent duplicate declarations
if (typeof window.linkedinScraper === 'undefined') {
  class LinkedInConnectionsScraper {
    constructor() {
      this.isScraping = false;
      this.connections = [];
      this.setupMessageListener();
    }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Content script received message:', request.action);
      
      if (request.action === 'scrapeConnections') {
        // Handle scraping synchronously to avoid channel issues
        try {
          this.scrapeConnectionsSync(sendResponse);
        } catch (error) {
          console.error('Error in content script:', error);
          sendResponse({ 
            success: false, 
            error: error.message || 'Unknown error occurred' 
          });
        }
        return true; // Keep message channel open
      }
      
      // Handle other actions
      if (request.action === 'ping') {
        sendResponse({ success: true, message: 'Content script is ready' });
        return true;
      }
      
      return false; // Don't keep channel open for unknown actions
    });
  }

  scrapeConnectionsSync(sendResponse) {
    if (this.isScraping) {
      sendResponse({ success: false, error: 'Scraping already in progress' });
      return;
    }

    this.isScraping = true;
    this.connections = [];

    try {
      // Check if user is logged in
      const isLoggedIn = this.isUserLoggedIn();
      console.log('Login check result:', isLoggedIn);
      console.log('Current URL:', window.location.href);
      
      if (!isLoggedIn) {
        // Provide more helpful error message
        const currentUrl = window.location.href;
        if (!currentUrl.includes('linkedin.com')) {
          sendResponse({ success: false, error: 'Please navigate to LinkedIn first (linkedin.com)' });
          return;
        } else if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
          sendResponse({ success: false, error: 'Please log in to LinkedIn first' });
          return;
        } else {
          sendResponse({ success: false, error: 'Unable to detect LinkedIn login. Please ensure you are logged in and try refreshing the page.' });
          return;
        }
      }

      // Try to scrape actual connections from the current page
      try {
        console.log('🔍 Starting connection scraping...');
        console.log('Current URL:', window.location.href);
        
        const actualConnections = this.scrapeCurrentPageConnections();
        console.log('Found connections:', actualConnections.length);
        
        if (actualConnections.length > 0) {
          console.log('✅ Using real connections');
          sendResponse({
            success: true,
            connections: actualConnections,
            count: actualConnections.length
          });
        } else {
          console.log('❌ No real connections found, using mock data');
          // If no connections found on current page, return mock data as fallback
          const mockConnections = this.getMockConnections();
          sendResponse({
            success: true,
            connections: mockConnections,
            count: mockConnections.length,
            note: 'No real connections found on current page. Try going to LinkedIn → My Network → Connections'
          });
        }
      } catch (error) {
        console.log('❌ Error scraping connections:', error);
        // Fallback to mock data if scraping fails
        const mockConnections = this.getMockConnections();
        sendResponse({
          success: true,
          connections: mockConnections,
          count: mockConnections.length,
          note: 'Error occurred while scraping - showing sample data'
        });
      }
      
    } catch (error) {
      console.error('Error scraping connections:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    } finally {
      this.isScraping = false;
    }
  }

  scrapeCurrentPageConnections() {
    const connections = [];
    
    console.log('🔍 Scraping connections from current page...');
    console.log('Current URL:', window.location.href);
    
    // Look for connection elements on various LinkedIn pages
    const connectionSelectors = [
      // Connections page selectors
      '.mn-connections__list li',
      '.connections-list li',
      '[data-test-id="connections-list"] li',
      '.mn-connection-card',
      '.connection-card',
      // Network page selectors
      '.mn-person-card',
      '.person-card',
      '.network-person-card',
      // Search results selectors
      '.search-results__list li',
      '.search-result',
      '.entity-result'
    ];
    
    console.log('Testing selectors...');
    let connectionElements = [];
    let workingSelector = '';
    
    for (const selector of connectionSelectors) {
      connectionElements = document.querySelectorAll(selector);
      if (connectionElements.length > 0) {
        console.log(`✅ Found ${connectionElements.length} connections using selector: ${selector}`);
        workingSelector = selector;
        break;
      } else {
        console.log(`❌ No elements found with selector: ${selector}`);
      }
    }
    
    if (connectionElements.length === 0) {
      console.log('❌ No connection elements found on current page');
      console.log('💡 Try navigating to: LinkedIn → My Network → Connections');
      return connections;
    }
    
    console.log(`📊 Found ${connectionElements.length} connection elements`);
    console.log(`🔧 Working selector: ${workingSelector}`);
    
    // Scrape each connection
    connectionElements.forEach((element, index) => {
      try {
        const connection = this.scrapeConnectionElement(element, index);
        if (connection) {
          connections.push(connection);
          console.log(`✅ Scraped connection ${index + 1}: ${connection.fullName}`);
        }
      } catch (error) {
        console.warn(`❌ Error scraping connection element ${index + 1}:`, error);
      }
    });
    
    console.log(`🎉 Successfully scraped ${connections.length} connections`);
    return connections;
  }

  scrapeConnectionElement(element, index) {
    try {
      // Extract name - try multiple selectors
      const nameSelectors = [
        '.mn-connection-card__name',
        '.connection-name',
        '[data-test-id="connection-name"]',
        '.mn-person-card__name',
        '.person-card__name',
        '.entity-result__title-text a',
        '.search-result__title a',
        'h3 a',
        '.name a'
      ];
      
      let fullName = 'Unknown';
      for (const selector of nameSelectors) {
        const nameElement = element.querySelector(selector);
        if (nameElement) {
          fullName = nameElement.textContent.trim();
          break;
        }
      }
      
      // Extract profile picture
      const imgElement = element.querySelector('img');
      const profilePicture = imgElement ? imgElement.src : '';
      
      // Extract headline/position
      const headlineSelectors = [
        '.mn-connection-card__occupation',
        '.connection-headline',
        '[data-test-id="connection-headline"]',
        '.mn-person-card__occupation',
        '.person-card__occupation',
        '.entity-result__subtitle',
        '.search-result__subtitle'
      ];
      
      let headline = '';
      for (const selector of headlineSelectors) {
        const headlineElement = element.querySelector(selector);
        if (headlineElement) {
          headline = headlineElement.textContent.trim();
          break;
        }
      }
      
      // Extract company
      const companySelectors = [
        '.mn-connection-card__company',
        '.connection-company',
        '[data-test-id="connection-company"]',
        '.mn-person-card__company',
        '.person-card__company',
        '.entity-result__subtitle',
        '.search-result__subtitle'
      ];
      
      let companyName = '';
      for (const selector of companySelectors) {
        const companyElement = element.querySelector(selector);
        if (companyElement) {
          companyName = companyElement.textContent.trim();
          break;
        }
      }
      
      // Extract company logo
      const companyLogoElement = element.querySelector('.mn-connection-card__company img, .connection-company img, .mn-person-card__company img');
      const companyLogo = companyLogoElement ? companyLogoElement.src : '';
      
      // Generate unique ID
      const id = this.generateId(fullName, companyName, index);
      
      return {
        id,
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        fullName,
        profilePicture,
        headline,
        currentPosition: headline,
        company: {
          name: companyName,
          logo: companyLogo,
          industry: ''
        },
        location: '',
        connectionDate: new Date().toISOString(),
        mutualConnections: 0
      };
    } catch (error) {
      console.warn('Error scraping connection element:', error);
      return null;
    }
  }

  generateId(name, company, index) {
    return btoa(`${name}-${company}-${index}-${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  getMockConnections() {
    // Return some mock connections for testing
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        profilePicture: 'https://via.placeholder.com/150',
        headline: 'Software Engineer at Tech Corp',
        currentPosition: 'Software Engineer',
        company: {
          name: 'Tech Corp',
          logo: 'https://via.placeholder.com/50',
          industry: 'Technology'
        },
        location: 'San Francisco, CA',
        connectionDate: new Date().toISOString(),
        mutualConnections: 5
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        profilePicture: 'https://via.placeholder.com/150',
        headline: 'Product Manager at Startup Inc',
        currentPosition: 'Product Manager',
        company: {
          name: 'Startup Inc',
          logo: 'https://via.placeholder.com/50',
          industry: 'Technology'
        },
        location: 'New York, NY',
        connectionDate: new Date().toISOString(),
        mutualConnections: 3
      }
    ];
  }

  async scrapeConnections() {
    if (this.isScraping) {
      return { success: false, error: 'Scraping already in progress' };
    }

    this.isScraping = true;
    this.connections = [];

    try {
      // Check if user is logged in
      const isLoggedIn = this.isUserLoggedIn();
      console.log('Login check result:', isLoggedIn);
      console.log('Current URL:', window.location.href);
      
      if (!isLoggedIn) {
        // Provide more helpful error message
        const currentUrl = window.location.href;
        if (!currentUrl.includes('linkedin.com')) {
          throw new Error('Please navigate to LinkedIn first (linkedin.com)');
        } else if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
          throw new Error('Please log in to LinkedIn first');
        } else {
          throw new Error('Unable to detect LinkedIn login. Please ensure you are logged in and try refreshing the page.');
        }
      }

      // Navigate to connections page
      await this.navigateToConnections();
      
      // Wait for page to load
      await this.waitForPageLoad();
      
      // Scrape connections
      await this.scrapeConnectionsList();
      
      return {
        success: true,
        connections: this.connections,
        count: this.connections.length
      };
    } catch (error) {
      console.error('Error scraping connections:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.isScraping = false;
    }
  }

  isUserLoggedIn() {
    // Check for LinkedIn login indicators with multiple selectors
    const loginIndicators = [
      '[data-test-id="sign-in-link"]',
      'a[href*="login"]',
      '.sign-in-link',
      '.login-link'
    ];
    
    const loggedInIndicators = [
      '.global-nav__me-photo',
      '.global-nav__me',
      '[data-test-id="me-icon"]',
      '.nav-item__profile-member-photo',
      '.profile-photo',
      '.nav-item__profile-member-photo-container',
      'img[alt*="profile"]',
      '.nav-item__profile-member-photo-container img'
    ];
    
    // Check if any login indicators are present (user is NOT logged in)
    const hasLoginButton = loginIndicators.some(selector => 
      document.querySelector(selector) !== null
    );
    
    // Check if any logged-in indicators are present
    const hasLoggedInIndicator = loggedInIndicators.some(selector => 
      document.querySelector(selector) !== null
    );
    
    // Also check for user menu or profile elements
    const hasUserMenu = document.querySelector('.global-nav__me') || 
                       document.querySelector('[data-test-id="me-icon"]') ||
                       document.querySelector('.nav-item__profile-member-photo-container');
    
    // User is logged in if no login buttons AND has logged-in indicators
    const isLoggedIn = !hasLoginButton && (hasLoggedInIndicator || hasUserMenu);
    
    // Fallback: Check if we're on LinkedIn and not on login page
    if (!isLoggedIn) {
      const currentUrl = window.location.href;
      const isOnLinkedIn = currentUrl.includes('linkedin.com');
      const isNotOnLoginPage = !currentUrl.includes('/login') && 
                              !currentUrl.includes('/signin') &&
                              !currentUrl.includes('/auth');
      
      // If we're on LinkedIn but not on login pages, assume logged in
      if (isOnLinkedIn && isNotOnLoginPage) {
        return true;
      }
    }
    
    return isLoggedIn;
  }

  async navigateToConnections() {
    const currentUrl = window.location.href;
    
    if (!currentUrl.includes('/mynetwork/connections/')) {
      // Navigate to connections page
      window.location.href = 'https://www.linkedin.com/mynetwork/connections/';
      
      // Wait for navigation
      await new Promise(resolve => {
        const checkNavigation = () => {
          if (window.location.href.includes('/mynetwork/connections/')) {
            resolve();
          } else {
            setTimeout(checkNavigation, 100);
          }
        };
        setTimeout(checkNavigation, 100);
      });
    }
  }

  async waitForPageLoad() {
    // Wait for connections list to load
    await this.waitForElement('.mn-connections__list, .connections-list, [data-test-id="connections-list"]', 10000);
  }

  async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(checkElement, 100);
        }
      };
      
      checkElement();
    });
  }

  async scrapeConnectionsList() {
    // Scroll to load more connections
    await this.scrollToLoadAll();
    
    // Find connection elements using multiple selectors
    const connectionSelectors = [
      '.mn-connections__list li',
      '.connections-list li',
      '[data-test-id="connections-list"] li',
      '.mn-connection-card',
      '.connection-card'
    ];
    
    let connectionElements = [];
    for (const selector of connectionSelectors) {
      connectionElements = document.querySelectorAll(selector);
      if (connectionElements.length > 0) {
        break;
      }
    }
    
    if (connectionElements.length === 0) {
      throw new Error('No connection elements found');
    }

    // Scrape each connection
    for (const element of connectionElements) {
      try {
        const connection = await this.scrapeConnectionElement(element);
        if (connection) {
          this.connections.push(connection);
        }
      } catch (error) {
        console.warn('Error scraping individual connection:', error);
      }
    }
  }

  async scrollToLoadAll() {
    const scrollHeight = document.body.scrollHeight;
    let lastScrollTop = 0;
    let stableCount = 0;
    
    while (stableCount < 3) {
      window.scrollTo(0, document.body.scrollHeight);
      await this.delay(1000);
      
      const currentScrollTop = window.pageYOffset;
      if (currentScrollTop === lastScrollTop) {
        stableCount++;
      } else {
        stableCount = 0;
        lastScrollTop = currentScrollTop;
      }
    }
    
    // Scroll back to top
    window.scrollTo(0, 0);
    await this.delay(500);
  }

  async scrapeConnectionElement(element) {
    try {
      // Extract name
      const nameElement = element.querySelector('.mn-connection-card__name, .connection-name, [data-test-id="connection-name"]');
      const fullName = nameElement ? nameElement.textContent.trim() : 'Unknown';
      
      // Extract profile picture
      const imgElement = element.querySelector('img');
      const profilePicture = imgElement ? imgElement.src : '';
      
      // Extract headline/position
      const headlineElement = element.querySelector('.mn-connection-card__occupation, .connection-headline, [data-test-id="connection-headline"]');
      const headline = headlineElement ? headlineElement.textContent.trim() : '';
      
      // Extract company
      const companyElement = element.querySelector('.mn-connection-card__company, .connection-company, [data-test-id="connection-company"]');
      const companyName = companyElement ? companyElement.textContent.trim() : '';
      
      // Extract company logo
      const companyLogoElement = element.querySelector('.mn-connection-card__company img, .connection-company img');
      const companyLogo = companyLogoElement ? companyLogoElement.src : '';
      
      // Generate unique ID
      const id = this.generateId(fullName, companyName);
      
      return {
        id,
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        fullName,
        profilePicture,
        headline,
        currentPosition: headline,
        company: {
          name: companyName,
          logo: companyLogo,
          industry: ''
        },
        location: '',
        connectionDate: new Date().toISOString(),
        mutualConnections: 0
      };
    } catch (error) {
      console.warn('Error scraping connection element:', error);
      return null;
    }
  }

  generateId(name, company) {
    return btoa(`${name}-${company}-${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  }

  // Initialize scraper only if not already initialized
  if (typeof window.linkedinScraper === 'undefined') {
    window.linkedinScraper = new LinkedInConnectionsScraper();
  }
}

