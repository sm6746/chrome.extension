// Test script to verify Chrome extension message passing
// Run this in the browser console on LinkedIn to test the extension

console.log('Testing LinkedIn Connections Extension...');

// Test 1: Check if content script is loaded
console.log('1. Testing content script...');
chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('❌ Content script not loaded:', chrome.runtime.lastError.message);
  } else if (response && response.success) {
    console.log('✅ Content script is loaded:', response.message);
  } else {
    console.log('❌ Content script not responding properly');
  }
});

// Test 2: Check if background script is working
console.log('2. Testing background script...');
chrome.runtime.sendMessage({ action: 'getConnections' }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('❌ Background script error:', chrome.runtime.lastError.message);
  } else if (response) {
    console.log('✅ Background script response:', response);
  } else {
    console.log('❌ No response from background script');
  }
});

// Test 3: Check current page
console.log('3. Current page info:');
console.log('- URL:', window.location.href);
console.log('- Is LinkedIn:', window.location.href.includes('linkedin.com'));
console.log('- Has profile elements:', document.querySelectorAll('.global-nav__me, .global-nav__me-photo').length > 0);

console.log('Test completed. Check the results above.');

