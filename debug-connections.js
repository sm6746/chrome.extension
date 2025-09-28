// Debug script to check what connections are found on the current LinkedIn page
// Run this in the browser console on LinkedIn to see what the extension can find

console.log('🔍 Debugging LinkedIn Connections...');
console.log('Current URL:', window.location.href);

// Check if we're on LinkedIn
if (!window.location.href.includes('linkedin.com')) {
  console.log('❌ Not on LinkedIn - please navigate to LinkedIn first');
} else {
  console.log('✅ On LinkedIn');
}

// Test all the selectors the extension uses
const connectionSelectors = [
  '.mn-connections__list li',
  '.connections-list li',
  '[data-test-id="connections-list"] li',
  '.mn-connection-card',
  '.connection-card',
  '.mn-person-card',
  '.person-card',
  '.network-person-card',
  '.search-results__list li',
  '.search-result',
  '.entity-result'
];

console.log('\n🔍 Testing connection selectors:');
let foundConnections = 0;
let workingSelector = '';

for (const selector of connectionSelectors) {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
    foundConnections += elements.length;
    if (!workingSelector) workingSelector = selector;
  } else {
    console.log(`❌ No elements found with selector: ${selector}`);
  }
}

console.log(`\n📊 Total connections found: ${foundConnections}`);

if (foundConnections > 0) {
  console.log(`✅ Working selector: ${workingSelector}`);
  console.log('✅ Extension should be able to scrape connections');
  
  // Show first few connections found
  const firstSelector = connectionSelectors.find(selector => document.querySelectorAll(selector).length > 0);
  if (firstSelector) {
    const elements = document.querySelectorAll(firstSelector);
    console.log(`\n📋 First ${Math.min(3, elements.length)} connections found:`);
    
    for (let i = 0; i < Math.min(3, elements.length); i++) {
      const element = elements[i];
      const nameElement = element.querySelector('h3, .name, .person-card__name, .mn-person-card__name, .entity-result__title-text a, .search-result__title a');
      const name = nameElement ? nameElement.textContent.trim() : 'No name found';
      console.log(`${i + 1}. ${name}`);
    }
  }
} else {
  console.log('❌ No connections found on current page');
  console.log('\n💡 Try these steps:');
  console.log('1. Go to LinkedIn → My Network → Connections');
  console.log('2. Or go to LinkedIn → My Network (main page)');
  console.log('3. Or search for people on LinkedIn');
  console.log('4. Make sure the page has loaded completely');
  console.log('5. Scroll down to load more connections');
}

// Check if we're on the right page
const currentPath = window.location.pathname;
console.log(`\n📍 Current page: ${currentPath}`);

if (currentPath.includes('/mynetwork/connections/')) {
  console.log('✅ On connections page - this should work');
} else if (currentPath.includes('/mynetwork/')) {
  console.log('✅ On network page - this should work');
} else if (currentPath.includes('/search/')) {
  console.log('✅ On search page - this should work');
} else {
  console.log('⚠️ Not on a page with connections - try going to My Network');
}

console.log('\n🔧 If no connections are found, try:');
console.log('1. Navigate to: https://www.linkedin.com/mynetwork/connections/');
console.log('2. Wait for the page to load completely');
console.log('3. Scroll down to load more connections');
console.log('4. Then try the extension again');

