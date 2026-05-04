const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    await page.type('input[type="email"]', 'ashwanidanodia75@gmail.com');
    await page.type('input[type="password"]', 'Test@123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    await page.goto('http://localhost:3000/kyc-verification', { waitUntil: 'networkidle2' });
    
    console.log("HTML length:", (await page.content()).length);
    const content = await page.evaluate(() => document.querySelector('.app-with-sidebar')?.innerHTML || 'No sidebar content');
    console.log("Sidebar content excerpt:", content.substring(0, 200));

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
