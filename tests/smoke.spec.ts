import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Critical functionality verification
 * These tests ensure the application is working at a basic level
 * and can be run quickly to verify deployment health
 */

test.describe('Smoke Tests', () => {
  
  test('Application loads and displays login page', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://www.saucedemo.com/');
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Verify critical elements are present
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    
    // Verify page is interactive (no loading states)
    await expect(page.getByPlaceholder('Username')).toBeEnabled();
    await expect(page.getByPlaceholder('Password')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
  });

  test('User can login with valid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Perform login
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login redirect
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify inventory page loads with expected content
    await expect(page.locator('#header_container [data-test="title"]')).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify at least one product is displayed
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('Shopping cart functionality works', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify we're on inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Add item to cart
    const addToCartButton = page.getByRole('button', { name: /Add to cart/i }).first();
    await addToCartButton.click();
    
    // Verify cart badge updates
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    
    // Verify cart page loads
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('Error handling for invalid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Attempt login with invalid credentials
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Epic sadface:')).toBeVisible();
    
    // Verify we remain on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Navigation menu works correctly', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify hamburger menu is present
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
    
    // Open menu
    await page.locator('#react-burger-menu-btn').click();
    
    // Verify menu items are visible
    await expect(page.getByText('All Items')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
    await expect(page.getByText('Reset App State')).toBeVisible();
    
    // Close menu
    await page.locator('#react-burger-cross-btn').click();
    
    // Verify menu is closed
    await expect(page.getByText('All Items')).not.toBeVisible();
  });

  test('Application handles empty states gracefully', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to cart (should be empty)
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify empty cart state
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    
    // Verify continue shopping button works
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    
    // Should return to inventory
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

//   test('Application performance - page load times', async ({ page }) => {
//     const startTime = Date.now();
    
//     await page.goto('https://www.saucedemo.com/');
    
//     // Wait for critical elements to be visible
//     await expect(page.getByPlaceholder('Username')).toBeVisible();
    
//     const loadTime = Date.now() - startTime;
    
//     // Verify page loads within reasonable time (5 seconds)
//     expect(loadTime).toBeLessThan(5000);
    
//     // Verify no console errors
//     const errors: string[] = [];
//     page.on('console', msg => {
//       if (msg.type() === 'error') {
//         errors.push(msg.text());
//       }
//     });
    
//     // Wait a bit to catch any delayed errors
//     await page.waitForTimeout(1000);
    
//     // Filter out known non-critical errors if any
//     const criticalErrors = errors.filter(error => 
//       !error.includes('favicon') && 
//       !error.includes('404') &&
//       !error.includes('net::ERR_')
//     );
    
//     expect(criticalErrors).toHaveLength(0);
//   });

});
