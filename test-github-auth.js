const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function testGitHubAuthFlow() {
  console.log('Starting GitHub authentication flow test...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    devtools: true,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  // Enable request interception to monitor network requests
  await page.setRequestInterception(true);
  
  const networkRequests = [];
  const networkResponses = [];
  
  page.on('request', (request) => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      timestamp: new Date().toISOString()
    });
    console.log(`📤 Request: ${request.method()} ${request.url()}`);
    request.continue();
  });

  page.on('response', (response) => {
    networkResponses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      timestamp: new Date().toISOString()
    });
    console.log(`📥 Response: ${response.status()} ${response.url()}`);
  });

  // Listen for console logs
  page.on('console', (msg) => {
    console.log(`🖥️  Console (${msg.type()}): ${msg.text()}`);
  });

  // Listen for page errors
  page.on('pageerror', (error) => {
    console.error(`❌ Page Error: ${error.message}`);
  });

  // Listen for failed requests
  page.on('requestfailed', (request) => {
    console.error(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    // Step 1: Navigate to the login page
    console.log('\\n🔗 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Take screenshot of login page
    await page.screenshot({ 
      path: path.join(screenshotsDir, '1-login-page.png'),
      fullPage: true 
    });
    console.log('✅ Login page loaded successfully');
    
    // Check if the login page loaded correctly
    const loginPageTitle = await page.title();
    console.log(`📄 Page title: ${loginPageTitle}`);
    
    // Step 2: Find and click the "Sign in with GitHub" button
    console.log('\\n🔘 Step 2: Looking for "Sign in with GitHub" button...');
    
    // Wait for the button to appear
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Find the GitHub login button
    const githubButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => 
        button.textContent.includes('Sign in with GitHub') || 
        button.textContent.includes('GitHub')
      );
    });
    
    if (!githubButton._remoteObject.value) {
      throw new Error('GitHub login button not found');
    }
    
    console.log('✅ GitHub login button found');
    
    // Take screenshot before clicking
    await page.screenshot({ 
      path: path.join(screenshotsDir, '2-before-click.png'),
      fullPage: true 
    });
    
    // Step 3: Click the GitHub login button
    console.log('\\n🖱️  Step 3: Clicking "Sign in with GitHub" button...');
    
    // Set up a promise to wait for navigation or new page
    const navigationPromise = page.waitForNavigation({ 
      waitUntil: 'networkidle2',
      timeout: 30000 
    }).catch(() => {
      console.log('⚠️  Navigation timeout - this might be expected if opening in new tab');
    });
    
    // Click the button
    await page.click('button');
    console.log('✅ Button clicked');
    
    // Wait a bit for any redirects or new pages
    await Promise.race([
      navigationPromise,
      new Promise(resolve => setTimeout(resolve, 5000))
    ]);
    
    // Take screenshot after clicking
    await page.screenshot({ 
      path: path.join(screenshotsDir, '3-after-click.png'),
      fullPage: true 
    });
    
    // Step 4: Check current URL and page state
    console.log('\\n🔍 Step 4: Checking current state...');
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // Check if we're on GitHub OAuth page
    if (currentUrl.includes('github.com')) {
      console.log('✅ Successfully redirected to GitHub OAuth page');
      
      // Take screenshot of GitHub OAuth page
      await page.screenshot({ 
        path: path.join(screenshotsDir, '4-github-oauth.png'),
        fullPage: true 
      });
      
      // Check for GitHub OAuth form elements
      const hasAuthorizeButton = await page.$('input[type="submit"][value*="Authorize"], button[type="submit"]');
      if (hasAuthorizeButton) {
        console.log('✅ GitHub OAuth authorization form found');
      } else {
        console.log('⚠️  GitHub OAuth form not immediately visible');
      }
      
    } else if (currentUrl.includes('localhost:3000/auth/callback')) {
      console.log('✅ Redirected to auth callback - checking for code parameter');
      
      const urlParams = new URL(currentUrl).searchParams;
      const code = urlParams.get('code');
      if (code) {
        console.log('✅ Authorization code found in callback URL');
      } else {
        console.log('❌ No authorization code in callback URL');
      }
      
    } else if (currentUrl.includes('localhost:3000/dashboard')) {
      console.log('✅ Successfully redirected to dashboard - authentication complete!');
      
    } else if (currentUrl.includes('localhost:3000/auth/auth-code-error')) {
      console.log('❌ Redirected to auth error page');
      
    } else {
      console.log(`⚠️  Unexpected URL: ${currentUrl}`);
    }
    
    // Step 5: Wait for any additional redirects and check final state
    console.log('\\n⏳ Step 5: Waiting for potential redirects...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, '5-final-state.png'),
      fullPage: true 
    });
    
    // Check if we ended up on the dashboard
    if (finalUrl.includes('/dashboard')) {
      console.log('🎉 Authentication flow completed successfully!');
      
      // Check if user data is displayed
      const userInfo = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
        const greeting = headings.find(h => h.textContent.includes('Good'));
        return greeting ? greeting.textContent : null;
      });
      
      if (userInfo) {
        console.log(`✅ User greeting found: ${userInfo}`);
      }
      
    } else {
      console.log('❌ Authentication flow did not complete successfully');
    }

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    
    // Take error screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true 
    });
    
    // Log current URL on error
    console.log(`📍 URL at error: ${page.url()}`);
  }

  // Generate network log report
  console.log('\\n📊 Network Activity Summary:');
  console.log(`Total requests: ${networkRequests.length}`);
  console.log(`Total responses: ${networkResponses.length}`);
  
  // Log key requests
  const authRequests = networkRequests.filter(req => 
    req.url.includes('github.com') || 
    req.url.includes('/auth/') || 
    req.url.includes('supabase')
  );
  
  if (authRequests.length > 0) {
    console.log('\\n🔐 Authentication-related requests:');
    authRequests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.method} ${req.url}`);
    });
  }
  
  // Log any error responses
  const errorResponses = networkResponses.filter(res => res.status >= 400);
  if (errorResponses.length > 0) {
    console.log('\\n❌ Error responses:');
    errorResponses.forEach((res, index) => {
      console.log(`${index + 1}. ${res.status} ${res.url}`);
    });
  }
  
  // Save detailed network log
  const networkLog = {
    requests: networkRequests,
    responses: networkResponses,
    summary: {
      totalRequests: networkRequests.length,
      totalResponses: networkResponses.length,
      authRequests: authRequests.length,
      errorResponses: errorResponses.length
    }
  };
  
  fs.writeFileSync(
    path.join(screenshotsDir, 'network-log.json'),
    JSON.stringify(networkLog, null, 2)
  );
  
  console.log('\\n📁 Screenshots and logs saved to ./screenshots/');
  console.log('\\n🔍 Test completed. Check the screenshots and network log for detailed analysis.');
  
  await browser.close();
}

// Run the test
testGitHubAuthFlow().catch(console.error);