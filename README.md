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



####  Background Script (background.js)
- Manages request queue and throttling
- Implements caching system with TTL
- Handles communication between content script and popup
- Provides API for the dashboard UI

####  Dashboard UI (React App)
- Modern React application with TypeScript
- Built with Vite for fast development
- Uses shadcn/ui components and Tailwind CSS
- Responsive design optimized for extension popup



### Key Technologies

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Chrome Extension APIs**: Storage, messaging, and content scripts




