import test, { expect } from '@playwright/test';
import { only } from 'node:test';

test('first playwright test', async ({ browser }) => {
   const context = await browser.newContext()
   const page = await context.newPage()
   await page.goto('https://www.google.com');
   console.log(await page.title())
   await expect(page).toHaveTitle('Google')
})

test('first playwright test 2', async ({ browser, page }) => {
   const userName = page.locator('#username')
   const password = page.locator('#password')
   const signIn = page.locator('#signInBtn')
   const cardTitle = page.locator(".card-body a")

   await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
   console.log(await page.title())
   await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy')
   //css 
   await userName.fill('rahulshetty')
   await password.fill('Learning@830$3mK2')
   await signIn.click()
   console.log(await page.locator("[style *= 'block']").textContent())
   await expect(page.locator("[style *= 'block']")).toContainText('Incorrect');

   //we use same fill to empty the field
   await userName.fill('')
   await userName.fill('rahulshettyacademy')
   await signIn.click()

   // console.log(await cardTitle.first().textContent())
   // console.log(await cardTitle.nth(1).textContent())

   const allTitles = await cardTitle.allTextContents();
   console.log("All titles: " + allTitles);


})

test('ui events', async ({ page }) => {
   await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');

   const dropdown = page.locator('select.form-control')
   await dropdown.selectOption('consult') //value
   await page.locator('.checkmark').last().click()
   await page.locator('#okayBtn').click()
   await expect(page.locator('.checkmark').last()).toBeChecked()
   console.log(await page.locator('.checkmark').last().isChecked())
   await page.locator('#terms').click()
   await expect(page.locator('#terms')).toBeChecked()
   await page.locator('#terms').uncheck()
   expect(await page.locator('#terms').isChecked()).toBeFalsy()

   //blinking text--- if the class attribute is binkingtext then the text is said to be blinking text
   const blinkingText = page.locator("[href*='documents-request']")
   await expect(blinkingText).toHaveAttribute('class', 'blinkingText')

   //await page.pause()
})

test.only('child windows handle', async ({ browser }) => {
   const context = await browser.newContext()
   const page = await context.newPage()
   const userName = page.locator('#username')

   await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
   const blinkingText = page.locator("[href*='documents-request']")
   // await blinkingText.click()//here the new page is opened. process is promise here(3 states- pending, rejected and fulfilled)
   // const page2 = context.waitForEvent('page')//listen to any new page is open or not

   //here both actions should happen in parallel. so we need to wrap it. PW has promise.all where we can wrap it 
   const [newPage] = await Promise.all(
      [context.waitForEvent('page'),
      blinkingText.click()
      ]
   )

   const text = await newPage.locator('.red').textContent()//textContent is used when the value is attached to DOM
   console.log(text);

   const arrayText = text.split('@')
   const email = arrayText[1].split(' ')[0]
   //console.log(email);

   await page.locator('#username').fill(email)
   console.log(await page.locator('#username').inputValue())//if it is not attached to DOM, but want to fetch the value from input then use inputValue
   
})