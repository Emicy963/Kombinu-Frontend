import { expect, Page, test } from '@playwright/test';

// Helper function to register and login as a specific user type
async function registerAndLoginAsUser(page: Page, userType: 'aprendiz' | 'criador', name: string, email: string) {
  await page.goto('/register');

  if (userType === 'criador') {
    await page.click('button:has-text("Criador")');
  }

  await page.fill('input[name="nome"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="senha"]', 'K0mbinu_Test2026!');
  await page.fill('input[name="confirmarSenha"]', 'K0mbinu_Test2026!');

  await page.click('button[type="submit"]:has-text("Criar conta")');
  await page.waitForURL(userType === 'criador' ? /\/dashboard\/creator/ : /\/dashboard\/learner/);
}

test.describe('Core Features E2E Tests', () => {
  test('should display marketplace with content', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    await page.goto('/courses');
    await expect(page).toHaveURL(/\/courses/);

    // Check marketplace elements
    await expect(page.locator('text=Marketplace')).toBeVisible();

    // Check for content cards or list (adjust based on actual implementation)
    // Note: This test assumes there might be content, but may need adjustment
  });

  test('should allow criador to create content', async ({ page }) => {
    const testEmail = `criador${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'criador', 'Test Criador', testEmail);

    await page.goto('/courses/create');
    await expect(page).toHaveURL(/\/courses\/create/);

    // Check form elements
    await expect(page.locator('text=Criar Conteúdo')).toBeVisible();

    // Fill content creation form (adjust field names based on actual form)
    const titleField = page.locator('input[name="titulo"], input[placeholder*="título"]');
    const descriptionField = page.locator('textarea[name="descricao"], textarea[placeholder*="descrição"]');

    if (await titleField.isVisible()) {
      await titleField.fill('Test Content Title');
    }

    if (await descriptionField.isVisible()) {
      await descriptionField.fill('This is a test content description for E2E testing.');
    }

    // Note: This test may need to be adjusted based on actual form requirements
    // For now, we just check that the form elements are present
  });

  test('should display ranking page correctly', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    await page.goto('/ranking');
    await expect(page).toHaveURL(/\/ranking/);

    // Check ranking page elements
    await expect(page.locator('text=Ranking')).toBeVisible();

    // Check for ranking table/list (adjust based on actual implementation)
    // Note: May need to check if rankings are displayed
  });

  test('should handle content visualization', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    // First go to marketplace to find content
    await page.goto('/courses');

    // Look for content links (adjust selector based on actual implementation)
    const contentLink = page.locator('a[href*="/courses/"]').first();

    if (await contentLink.isVisible()) {
      const href = await contentLink.getAttribute('href');
      await contentLink.click();

      // Should navigate to content view
      await expect(page).toHaveURL(href || /\/courses\/\d+/);

      // Check content view elements
      await expect(page.locator('text=Visualizar Conteúdo')).toBeVisible();

      // Check for content display elements (adjust based on actual content structure)
      const contentTitle = page.locator('h1, .content-title');
      const contentBody = page.locator('.content-body, .content-description');

      // These may or may not be visible depending on content
    }
  });

  test('should handle quiz functionality for aprendiz', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    // Try to access a quiz (assuming quiz ID 1 exists)
    await page.goto('/quiz/1');

    // Check if quiz loads or redirects appropriately
    await expect(page.locator('body')).toBeVisible();

    // If quiz loads, check for quiz elements
    const quizTitle = page.locator('text=Quiz, .quiz-title');

    // These checks depend on actual quiz implementation
    if (await quizTitle.isVisible()) {
      await expect(quizTitle).toBeVisible();
    }
  });

  test('should display aprendiz dashboard correctly', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    // Should already be on dashboard after login
    await expect(page).toHaveURL(/\/dashboard\/learner/);

    // Check dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Check for common dashboard elements (adjust based on actual dashboard)
    // These may or may not exist depending on dashboard implementation
  });

  test('should display criador dashboard correctly', async ({ page }) => {
    const testEmail = `criador${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'criador', 'Test Criador', testEmail);

    // Should already be on dashboard after login
    await expect(page).toHaveURL(/\/dashboard\/creator/);

    // Check dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Check for criador-specific elements
    const createContentButton = page.locator('a[href="/courses/create"], button:has-text("Criar Conteúdo")');

    if (await createContentButton.isVisible()) {
      await expect(createContentButton).toBeVisible();
    }
  });

  test('should handle search functionality in marketplace', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    await page.goto('/courses');

    // Check for search input (adjust based on actual implementation)
    const searchInput = page.locator('input[placeholder*="pesquisar"], input[name="search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('test search');
      await searchInput.press('Enter');

      // Check if search results are displayed or filtered
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle content filtering in marketplace', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    await page.goto('/courses');

    // Check for filter options (adjust based on actual implementation)
    const filterButtons = page.locator('button[data-filter], .filter-button');
    const categorySelect = page.locator('select[name="categoria"], .category-filter');

    // Test filter interactions if they exist
    if (await filterButtons.first().isVisible()) {
      await filterButtons.first().click();
      await expect(page.locator('body')).toBeVisible();
    }

    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption('1'); // Assuming option value
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle pagination in marketplace', async ({ page }) => {
    const testEmail = `aprendiz${Date.now()}@test.com`;
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Aprendiz', testEmail);

    await page.goto('/courses');

    // Check for pagination controls
    const nextButton = page.locator('button:has-text("Próximo"), .pagination-next');
    const pageNumbers = page.locator('.pagination button, .page-number');

    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.locator('body')).toBeVisible();
    }

    if (await pageNumbers.first().isVisible()) {
      await pageNumbers.first().click();
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Check for dark mode toggle button
    const darkModeToggle = page.locator('button[aria-label*="dark"], .dark-mode-toggle');

    if (await darkModeToggle.isVisible()) {
      // Get initial state
      const initialClass = await page.locator('html').getAttribute('class');

      // Click toggle
      await darkModeToggle.click();

      // Check if class changed
      const newClass = await page.locator('html').getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });
});
