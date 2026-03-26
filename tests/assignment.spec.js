import test from "@playwright/test";


test('Assignement 1' , async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator("[type='email']").fill('saikrishnashetty07@gmail.com')
    await page.locator("#userPassword").fill('Learning@123');
    await page.locator('#login').click()

    // console.log(await page.locator('.card-body b').first().textContent())
    // console.log(await page.locator('.card-body b').nth(1).textContent())
    // console.log(await page.locator('.card-body b').last().textContent())

    //await page.waitForLoadState('networkidle') or this is discouraged
    await page.locator('.card-body b').last().waitFor(); //alternate this is all because allTextContents is not having any build in wait mechanism

    const allTitles = await page.locator('.card-body b').allTextContents()
    console.log(allTitles);
    
})