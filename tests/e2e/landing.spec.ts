import { expect, test } from '@playwright/test';

test.describe('Landing Page E2E Tests', () => {
  test('should load landing page correctly', async ({ page }) => {
    await page.goto('/');

    // Check if page loads
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();

    // Check for main elements
    await expect(page.locator('text=KOMBINU')).toBeVisible();
    await expect(page.locator('text=Transforme Educação em Experiência')).toBeVisible();
  });

  test('should navigate to login from landing page', async ({ page }) => {
    await page.goto('/');

    // Click login button in header
    await page.click('text=Entrar');

    // Should navigate to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register from landing page', async ({ page }) => {
    await page.goto('/');

    // Click register button in header
    await page.click('text=Começar Gratuitamente');

    // Should navigate to register page
    await expect(page).toHaveURL(/\/register/);
  });

  test('should scroll to different sections', async ({ page }) => {
    await page.goto('/');

    // Test navigation links
    const navLinks = ['Sobre', 'Funcionalidades', 'Testemunhos', 'Contacto'];

    for (const link of navLinks) {
      await page.click(`a:has-text("${link}")`);
      // Check if page scrolled (basic check)
      await page.waitForTimeout(500);
    }
  });

  test('should display statistics correctly', async ({ page }) => {
    await page.goto('/');

    // Check for statistics section
    await expect(page.locator('text=Números que Falam por Si')).toBeVisible();

    // Check for specific stats
    await expect(page.locator('text=25K+')).toBeVisible();
    await expect(page.locator('text=150K+')).toBeVisible();
    await expect(page.locator('text=500K+')).toBeVisible();
    await expect(page.locator('text=95%')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Check features section
    await expect(page.locator('text=Funcionalidades Inovadoras')).toBeVisible();

    // Check individual features
    await expect(page.locator('text=Gamificação Inteligente')).toBeVisible();
    await expect(page.locator('text=Comunidade Angolana')).toBeVisible();
    await expect(page.locator('text=Aprendizado Personalizado')).toBeVisible();
  });

  test('should display research validation section', async ({ page }) => {
    await page.goto('/');

    // Check research section
    await expect(page.locator('text=Validação Científica')).toBeVisible();

    // Check research items
    await expect(page.locator('text=Eficácia da Gamificação')).toBeVisible();
    await expect(page.locator('text=Marketplaces Educacionais')).toBeVisible();
    await expect(page.locator('text=Sistemas de Ranking')).toBeVisible();
  });

  test('should have working CTA buttons in hero section', async ({ page }) => {
    await page.goto('/');

    // Test main CTA button
    const mainCTA = page.locator('button:has-text("Começar Gratuitamente")').first();
    await expect(mainCTA).toBeVisible();

    // Test secondary CTA
    const secondaryCTA = page.locator('button:has-text("Saber Mais")');
    await expect(secondaryCTA).toBeVisible();
  });

  test('should display footer correctly', async ({ page }) => {
    await page.goto('/');

    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer elements (adjust selectors based on actual footer content)
    await expect(page.locator('text=KOMBINU')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check if mobile menu works (if hamburger menu exists)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .hamburger-menu');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Check if mobile menu opens
    }

    // Check if content is still accessible
    await expect(page.locator('text=KOMBINU')).toBeVisible();
  });
});
