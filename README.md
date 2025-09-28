# LinkedIn Connections Dashboard - Chrome Extension

A Chrome extension that fetches and displays your LinkedIn connections in a clean, responsive dashboard with caching and throttling capabilities.

## Features

- 🔗 **LinkedIn Integration**: Seamlessly accesses your LinkedIn connections using your existing session
- 📊 **Clean Dashboard**: Modern, responsive UI built with React and Tailwind CSS
- 💾 **Smart Caching**: Implements localStorage caching with TTL (5-10 minutes) to reduce API calls
- ⚡ **Request Throttling**: Randomized delays (300-1000ms) between requests to avoid rate limits
- 🔍 **Search & Filter**: Filter connections by company and search by name, position, or company
- 🖼️ **Rich Data**: Displays profile pictures, names, companies with logos, and positions
- 🛡️ **Error Handling**: Graceful handling of failed requests and invalid sessions

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkedin-reach-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the project root directory
   - The extension should now appear in your extensions list

### Production Installation

1. Build the extension: `npm run build`
2. Create a ZIP file of the project root (excluding node_modules, .git, etc.)
3. Upload to Chrome Web Store or distribute as a packaged extension

## How to Use

1. **Login to LinkedIn**: Ensure you're logged into LinkedIn in your Chrome browser
2. **Open the Extension**: Click the extension icon in your Chrome toolbar
3. **View Connections**: The dashboard will automatically load your LinkedIn connections
4. **Search & Filter**: Use the search bar and company filter to find specific connections
5. **Refresh Data**: Click the "Refresh" button to fetch the latest connections
6. **Clear Cache**: Use "Clear Cache" to force fresh data retrieval

## Technical Architecture

### Chrome Extension Components

#### 1. Manifest (manifest.json)
- Defines extension permissions and structure
- Requires `activeTab`, `storage`, and `scripting` permissions
- Host permissions for `linkedin.com`

#### 2. Content Script (content.js)
- Injected into LinkedIn pages
- Scrapes connection data from the DOM
- Handles navigation to connections page
- Implements scrolling to load all connections

#### 3. Background Script (background.js)
- Manages request queue and throttling
- Implements caching system with TTL
- Handles communication between content script and popup
- Provides API for the dashboard UI

#### 4. Dashboard UI (React App)
- Modern React application with TypeScript
- Built with Vite for fast development
- Uses shadcn/ui components and Tailwind CSS
- Responsive design optimized for extension popup

### Caching Strategy

The extension implements a sophisticated caching system:

```typescript
interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}
```

- **TTL**: 5 minutes for connections data
- **Storage**: Chrome's `chrome.storage.local` API
- **Invalidation**: Automatic expiration and manual clear
- **Fallback**: Graceful degradation when cache is unavailable

### Request Queue & Throttling

To avoid LinkedIn rate limits, the extension implements:

- **Request Queue**: Sequential processing of scraping requests
- **Randomized Delays**: 300-1000ms between requests
- **Human-like Behavior**: Mimics natural browsing patterns
- **Error Recovery**: Retry logic for failed requests

### LinkedIn Reverse Engineering

The extension accesses LinkedIn connections by:

1. **Session Detection**: Checks for existing LinkedIn login session
2. **Navigation**: Programmatically navigates to `/mynetwork/connections/`
3. **DOM Scraping**: Extracts data from connection list elements
4. **Data Parsing**: Processes profile information, company details, and images
5. **Scroll Loading**: Automatically scrolls to load all connections

**Key Selectors Used**:
- Connection cards: `.mn-connection-card`, `.connection-card`
- Names: `.mn-connection-card__name`, `.connection-name`
- Companies: `.mn-connection-card__company`, `.connection-company`
- Profile images: `img` elements within connection cards

## Development

### Project Structure

```
├── manifest.json          # Chrome extension manifest
├── content.js            # Content script for LinkedIn scraping
├── background.js         # Background script for queue and caching
├── src/
│   ├── components/       # React components
│   ├── types/           # TypeScript type definitions
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── public/              # Static assets
└── dist/                # Built extension files
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Key Technologies

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Chrome Extension APIs**: Storage, messaging, and content scripts

## Limitations & Assumptions

### Technical Limitations

1. **LinkedIn Changes**: LinkedIn may update their DOM structure, breaking selectors
2. **Rate Limiting**: Despite throttling, LinkedIn may still impose rate limits
3. **Session Dependencies**: Requires active LinkedIn login session
4. **Browser Compatibility**: Designed specifically for Chrome/Chromium browsers

### Assumptions

1. **User Authentication**: Users are already logged into LinkedIn
2. **Connection Access**: Users have connections visible in their network
3. **DOM Structure**: LinkedIn's connection page structure remains stable
4. **Permissions**: Users grant necessary extension permissions

### Privacy Considerations

- **Data Storage**: All data is stored locally in the browser
- **No External Servers**: No data is sent to external services
- **Session Respect**: Uses existing LinkedIn session without storing credentials
- **User Control**: Users can clear cache and data at any time

## Troubleshooting

### Common Issues

1. **"User not logged in" Error**
   - Ensure you're logged into LinkedIn in the same browser
   - Try refreshing the LinkedIn page and retry

2. **"No connection elements found" Error**
   - LinkedIn may have updated their page structure
   - Check if you're on the correct connections page
   - Try refreshing the extension

3. **Extension Not Loading**
   - Ensure all files are present in the extension directory
   - Check Chrome's extension console for errors
   - Verify manifest.json is valid

4. **Slow Loading**
   - This is normal due to throttling to avoid rate limits
   - Large connection lists may take several minutes to load
   - Use the cache to speed up subsequent loads

### Debug Mode

Enable Chrome's extension debugging:
1. Go to `chrome://extensions/`
2. Click "Details" on the extension
3. Enable "Allow in incognito" for testing
4. Use Chrome DevTools to inspect the extension

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review Chrome extension documentation

---

**Note**: This extension is for educational and personal use. Please respect LinkedIn's Terms of Service and use responsibly.
