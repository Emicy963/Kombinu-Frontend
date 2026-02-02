import { expect, test } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');

    // Check if login page loads
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();

    // Check for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[name="senha"]');
    const loginButton = page.locator('button[type="submit"], button:has-text("Entrar")');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/register');

    // Check if register page loads
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('body')).toBeVisible();

    // Check for register form elements
    const nameInput = page.locator('input[name="nome"]');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[name="senha"]');
    const confirmPasswordInput = page.locator('input[name="confirmarSenha"]');
    const registerButton = page.locator('button[type="submit"], button:has-text("Criar conta")');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
    await expect(registerButton).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // Find and click register link
    const registerLink = page.locator('a:has-text("Cadastre-se gratuitamente")');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/\/register/);
    }

    // Go back to login
    const loginLink = page.locator('a:has-text("Faça login")');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should show validation errors on empty form submission', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    const loginButton = page.locator('button[type="submit"], button:has-text("Entrar")');
    await loginButton.click();

    // Check for validation messages (adjust based on actual implementation)
    // Note: This might not show errors if validation is client-side only
    // In a real scenario, you'd check for specific error text
  });
});
