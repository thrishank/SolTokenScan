import { Builder, By, until, WebElement } from "selenium-webdriver";
import * as fs from "fs";
import { Options } from "selenium-webdriver/chrome";
import * as path from "path";

export async function screenshot(network: string, address: string) {
  // Set Chrome options
  const chromeOptions = new Options();
  chromeOptions.addArguments("--headless"); // Run in headless mode
  chromeOptions.addArguments("--no-sandbox"); // Needed for running in a container
  chromeOptions.addArguments("--disable-dev-shm-usage"); // Prevent shared memory issues
  chromeOptions.addArguments("--disable-gpu"); // Disable GPU acceleration
  chromeOptions.addArguments("--remote-debugging-port=9222"); // Needed for remote execution

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // Set a large browser window size for high-resolution screenshots
    await driver.manage().window().setRect({ width: 1920, height: 1080 });

    await driver.get(`https://app.bubblemaps.io/${network}/token/${address}`);
    await driver.sleep(5000);

    await driver.wait(until.elementLocated(By.id("svg")), 8000);
    const svgElement: WebElement = await driver.findElement(By.id("svg"));

    // Use JavaScript to set SVG size dynamically for high resolution
    await driver.executeScript(`
      const svg = document.getElementById("svg");
      if (svg) {
        svg.setAttribute("width", "2000px");
        svg.setAttribute("height", "2000px");
      }
    `);

    // Wait a bit for changes to take effect
    await driver.sleep(2000);

    // Take a screenshot of the SVG element
    const elementScreenshot = await svgElement.takeScreenshot();

    // Ensure img directory exists
    const imgDir = path.resolve("img");
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, { recursive: true });
    }

    const screenshotPath = path.join(imgDir, `${address}_${network}.png`);
    fs.writeFileSync(screenshotPath, elementScreenshot, "base64");

    console.log(`✅ screenshot saved at: ${screenshotPath}`);
    return screenshotPath;
  } catch (err) {
    console.error("❌ Error taking screenshot:", err);
    return null;
  } finally {
    await driver.quit();
  }
}
