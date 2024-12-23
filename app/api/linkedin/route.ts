import { NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to extract job ID from various LinkedIn URL formats
function extractJobId(url: string): string | null {
  try {
    const patterns = [
      /currentJobId=(\d+)/,
      /jobs\/view\/(\d+)/,
      /jobs\/(\d+)/,
      /\/(\d{10})(?:\?|\/|$)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting job ID:', error);
    return null;
  }
}

export async function POST(req: Request) {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    const { action, query, url } = await req.json();
    console.log('Starting LinkedIn operation:', { action, query, url });

    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-features=BlockInsecurePrivateNetworkRequests',
        '--start-maximized',
      ]
    });

    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    if (action === 'searchJobs') {
      // First ensure user is logged in
      console.log('Checking login status...');
      await page.goto('https://www.linkedin.com/login', { 
        waitUntil: 'networkidle0', 
        timeout: 60000 
      });
      await delay(3000);

      // Wait for successful login
      console.log('Waiting for manual login...');
      let isLoggedIn = false;
      let attempts = 0;
      const maxAttempts = 120; // 10 minutes

      while (!isLoggedIn && attempts < maxAttempts) {
        await delay(5000); // Check every 5 seconds
        
        isLoggedIn = await page.evaluate(() => {
          const feedModule = document.querySelector('.feed-identity-module');
          const navMenu = document.querySelector('.global-nav__me-menu');
          const profilePhoto = document.querySelector('[data-control-name="identity_profile_photo"]');
          return feedModule !== null || navMenu !== null || profilePhoto !== null;
        });

        if (isLoggedIn) {
          console.log('Successfully logged in!');
          await delay(3000);
          break;
        }

        attempts++;
        console.log(`Waiting for login... Attempt ${attempts}/${maxAttempts}`);
      }

      if (!isLoggedIn) {
        throw new Error('Login timeout - please log in within 10 minutes');
      }

      // Now navigate to job search
      const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&f_AL=true&sortBy=DD`;
      console.log('Navigating to search URL:', searchUrl);
      
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 60000 
      });
      await delay(5000);

      // Wait for job listings to load
      await page.waitForSelector('.jobs-search-results__list-item', { timeout: 30000 });

      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.jobs-search-results__list-item');
        return Array.from(jobCards).map(card => {
          const titleElement = card.querySelector('.job-card-list__title');
          const companyElement = card.querySelector('.job-card-container__company-name');
          const locationElement = card.querySelector('.job-card-container__metadata-item');
          const jobIdElement = card.querySelector('div[data-job-id]');
          const jobId = jobIdElement?.getAttribute('data-job-id');

          return {
            id: jobId,
            title: titleElement?.textContent?.trim(),
            company: companyElement?.textContent?.trim(),
            location: locationElement?.textContent?.trim(),
            easyApplyLink: jobId ? `https://www.linkedin.com/jobs/view/${jobId}/` : null
          };
        }).filter(job => job.id && job.title);
      });

      console.log(`Found ${jobs.length} jobs`);
      await browser.close();
      return NextResponse.json(jobs);
    }

    if (action === 'getDescription') {
      let jobUrl = url;
      
      if (!jobUrl) {
        throw new Error('No valid job URL provided');
      }

      console.log('Navigating to job URL:', jobUrl);

      // Navigate directly to the job URL
      await page.goto(jobUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 60000 
      });
      await delay(5000);

      // Check if we need to log in
      const isLoginRequired = await page.evaluate(() => {
        return document.querySelector('.authwall-join-form') !== null ||
               document.querySelector('.login-form') !== null ||
               document.querySelector('button[data-tracking-control-name="auth_wall_desktop_modal-login"]') !== null;
      });

      if (isLoginRequired) {
        console.log('Login required. Please log in manually...');
        
        // Wait for successful login (max 10 minutes)
        let isLoggedIn = false;
        let attempts = 0;
        const maxAttempts = 120; // 10 minutes (5 seconds * 120)

        while (!isLoggedIn && attempts < maxAttempts) {
          await delay(5000); // Check every 5 seconds
          
          isLoggedIn = await page.evaluate(() => {
            // Check for job description elements that would only be visible after login
            const jobDescription = document.querySelector('.jobs-description');
            const jobContent = document.querySelector('.jobs-description-content');
            const jobDetails = document.querySelector('.jobs-box__html-content');
            
            return jobDescription !== null || jobContent !== null || jobDetails !== null;
          });

          if (isLoggedIn) {
            console.log('Successfully logged in!');
            await delay(3000); // Wait for content to fully load
            break;
          }

          attempts++;
          console.log(`Waiting for login... Attempt ${attempts}/${maxAttempts}`);
        }

        if (!isLoggedIn) {
          throw new Error('Login timeout - please log in within 10 minutes');
        }
      }

      // Extract job description
      const description = await page.evaluate(() => {
        const selectors = [
          '.jobs-description',
          '.jobs-description-content',
          '.show-more-less-html__markup',
          '[data-job-description]',
          '.description__text',
          '.job-details',
          '.jobs-box__html-content'
        ];

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            return element.textContent?.trim();
          }
        }

        // Try alternative selectors
        const possibleContainers = document.querySelectorAll('div[class*="description"], div[class*="details"]');
        for (const container of Array.from(possibleContainers)) {
          const text = container.textContent?.trim();
          if (text && text.length > 100) {
            return text;
          }
        }

        return null;
      });

      if (!description) {
        throw new Error('Failed to extract job description');
      }

      console.log('Successfully extracted job description');
      await browser.close();
      return NextResponse.json({ description });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('LinkedIn operation error:', error);
    if (page) await page.close();
    if (browser) await browser.close();
    return NextResponse.json({ 
      error: 'Failed to perform LinkedIn operation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to scroll and load more jobs
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await delay(2000); // Wait for any lazy-loaded content
}
