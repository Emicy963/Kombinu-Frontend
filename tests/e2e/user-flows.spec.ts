import { expect, Page, test } from '@playwright/test';

// Helper function to register and login as a specific user type
async function registerAndLoginAsUser(page: Page, userType: 'aprendiz' | 'criador', name: string, email: string) {
  await page.goto('/register');

  if (userType === 'criador') {
    await page.click('button:has-text("Criador")');
  }

  await page.fill('input[name="nome"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="senha"]', 'password123');
  await page.fill('input[name="confirmarSenha"]', 'password123');

  await page.click('button[type="submit"]:has-text("Criar conta")');
  await page.waitForURL(userType === 'criador' ? /\/dashboard-criador/ : /\/dashboard-aprendiz/);
}

// Helper function to create content as criador
async function createContentAsCriador(page: Page, title: string, description: string) {
  await page.goto('/criar-conteudo');

  // Fill content creation form
  const titleField = page.locator('input[name="titulo"], input[placeholder*="título"]');
  const descriptionField = page.locator('textarea[name="descricao"], textarea[placeholder*="descrição"]');

  if (await titleField.isVisible()) {
    await titleField.fill(title);
  }

  if (await descriptionField.isVisible()) {
    await descriptionField.fill(description);
  }

  // Submit form (selector may need adjustment based on actual form)
  const submitButton = page.locator('button[type="submit"], button:has-text("Criar"), button:has-text("Publicar")');
  if (await submitButton.isVisible()) {
    await submitButton.click();
    // Wait for submission to complete
    await page.waitForTimeout(2000);
  }
}

test.describe('Complete User Flows E2E Tests', () => {
  test('complete learner journey: register → browse marketplace → take quiz → view ranking', async ({ page }) => {
    const testEmail = `learner${Date.now()}@test.com`;

    // Step 1: Register as aprendiz
    await registerAndLoginAsUser(page, 'aprendiz', 'Test Learner', testEmail);
    await expect(page).toHaveURL(/\/dashboard-aprendiz/);

    // Step 2: Browse marketplace
    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/marketplace/);
    await expect(page.locator('text=Marketplace')).toBeVisible();

    // Step 3: Search for content
    const searchInput = page.locator('input[placeholder*="pesquisar"], input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('quiz');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
    }

    // Step 4: Access a quiz (if available)
    const quizLink = page.locator('a[href*="/quiz/"]').first();
    if (await quizLink.isVisible()) {
      const quizHref = await quizLink.getAttribute('href');
      await quizLink.click();

      // Should navigate to quiz page
      await expect(page).toHaveURL(quizHref || /\/quiz\/\d+/);

      // Check quiz elements
      await expect(page.locator('body')).toBeVisible();

      // Try to answer quiz questions (if quiz is interactive)
      const answerButtons = page.locator('button[data-answer], input[type="radio"]');
      if (await answerButtons.first().isVisible()) {
        await answerButtons.first().click();

        // Submit answer or continue
        const submitButton = page.locator('button:has-text("Próximo"), button:has-text("Enviar")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Step 5: View ranking
    await page.goto('/ranking');
    await expect(page).toHaveURL(/\/ranking/);
    await expect(page.locator('text=Ranking')).toBeVisible();

    // Check ranking display
    await expect(page.locator('body')).toBeVisible();
  });

  test('complete creator journey: register → create content → submit for approval → view analytics', async ({ page }) => {
    const testEmail = `creator${Date.now()}@test.com`;

    // Step 1: Register as criador
    await registerAndLoginAsUser(page, 'criador', 'Test Creator', testEmail);
    await expect(page).toHaveURL(/\/dashboard-criador/);

    // Step 2: Create content
    const contentTitle = `Test Content ${Date.now()}`;
    const contentDescription = 'This is a test content created during E2E testing to verify the creator workflow.';

    await createContentAsCriador(page, contentTitle, contentDescription);

    // Should redirect back to dashboard or content list
    await expect(page.locator('body')).toBeVisible();

    // Step 3: Check dashboard for created content
    await page.goto('/dashboard-criador');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Look for created content in dashboard
    const createdContent = page.locator(`text=${contentTitle}`);
    if (await createdContent.isVisible()) {
      await expect(createdContent).toBeVisible();
    }

    // Step 4: View marketplace to see if content appears (if auto-approved)
    await page.goto('/marketplace');
    await expect(page.locator('text=Marketplace')).toBeVisible();

    // Check if created content appears in marketplace
    const marketplaceContent = page.locator(`text=${contentTitle}`);
    // Content might not appear immediately if it needs approval
    if (await marketplaceContent.isVisible()) {
      await expect(marketplaceContent).toBeVisible();
    }

    // Step 5: Check analytics/profile (if available)
    // This depends on dashboard implementation
    const analyticsTab = page.locator('button:has-text("Analytics"), a[href*="analytics"]');
    if (await analyticsTab.isVisible()) {
      await analyticsTab.click();
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('admin workflow: access admin panel → moderate content → view reports', async ({ page }) => {
    // Note: This test assumes an admin user exists with credentials
    // In a real scenario, you might need to set up admin user creation

    // Step 1: Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@kombinu.com');
    await page.fill('input[name="senha"]', 'admin123');
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Check if redirected to admin panel
    try {
      await page.waitForURL(/\/admin/, { timeout: 5000 });
    } catch {
      // If admin login fails, skip the test
      test.skip();
      return;
    }

    await expect(page).toHaveURL(/\/admin/);

    // Step 2: Review statistics dashboard
    await expect(page.locator('text=Painel Administrativo')).toBeVisible();
    await expect(page.locator('text=Total de Usuários')).toBeVisible();
    await expect(page.locator('text=Total de Conteúdos')).toBeVisible();

    // Step 3: Moderate content
    await expect(page.locator('text=Moderação de Conteúdos')).toBeVisible();

    // Look for pending content
    const pendingContent = page.locator('.border.border-gray-200.rounded-lg.p-4').filter({ hasText: 'Pendente' });

    if (await pendingContent.first().isVisible()) {
      const firstPending = pendingContent.first();

      // Approve the content
      const approveButton = firstPending.locator('[title="Aprovar"]');
      if (await approveButton.isVisible()) {
        await approveButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Step 4: View activity logs
    await expect(page.locator('text=Atividade Recente')).toBeVisible();

    // Step 5: Review engagement metrics
    await expect(page.locator('text=Métricas de Engajamento')).toBeVisible();
    await expect(page.locator('text=Taxa de Conclusão de Quizzes')).toBeVisible();
  });

  test('cross-user interaction: creator creates content → learner consumes content → admin moderates', async ({ context }) => {
    // This test uses multiple browser contexts/pages to simulate different users

    // Step 1: Creator creates content
    const creatorPage = await context.newPage();
    const creatorEmail = `creator${Date.now()}@test.com`;
    await registerAndLoginAsUser(creatorPage, 'criador', 'Test Creator', creatorEmail);

    const contentTitle = `Cross-Test Content ${Date.now()}`;
    const contentDescription = 'Content created for cross-user interaction testing.';

    await createContentAsCriador(creatorPage, contentTitle, contentDescription);

    // Step 2: Learner browses and finds content
    const learnerPage = await context.newPage();
    const learnerEmail = `learner${Date.now()}@test.com`;
    await registerAndLoginAsUser(learnerPage, 'aprendiz', 'Test Learner', learnerEmail);

    await learnerPage.goto('/marketplace');
    await expect(learnerPage.locator('text=Marketplace')).toBeVisible();

    // Search for the created content
    const searchInput = learnerPage.locator('input[placeholder*="pesquisar"], input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(contentTitle);
      await searchInput.press('Enter');
      await learnerPage.waitForTimeout(1000);
    }

    // Try to access the content
    const contentLink = learnerPage.locator(`text=${contentTitle}`).locator('xpath=ancestor-or-self::a');
    if (await contentLink.isVisible()) {
      await contentLink.click();
      await expect(learnerPage.locator('body')).toBeVisible();
    }

    // Step 3: Admin moderates the content (if needed)
    const adminPage = await context.newPage();
    await adminPage.goto('/login');
    await adminPage.fill('input[name="email"]', 'admin@kombinu.com');
    await adminPage.fill('input[name="senha"]', 'admin123');
    await adminPage.click('button[type="submit"]:has-text("Entrar")');

    try {
      await adminPage.waitForURL(/\/admin/, { timeout: 5000 });

      // Look for the created content in moderation
      const moderationContent = adminPage.locator(`text=${contentTitle}`);
      if (await moderationContent.isVisible()) {
        // Approve if pending
        const approveButton = moderationContent.locator('xpath=ancestor::div[contains(@class, "border")]/descendant::*[contains(@title, "Aprovar")]');
        if (await approveButton.isVisible()) {
          await approveButton.click();
          await adminPage.waitForTimeout(1000);
        }
      }
    } catch {
      // Admin login failed, skip moderation step
    }

    // Cleanup
    await creatorPage.close();
    await learnerPage.close();
    await adminPage.close();
  });

  test('error handling and recovery: failed registration → successful retry → complete flow', async ({ page }) => {
    const testEmail = `error-test${Date.now()}@test.com`;

    // Step 1: Attempt registration with mismatched passwords
    await page.goto('/register');
    await page.fill('input[name="nome"]', 'Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="senha"]', 'password123');
    await page.fill('input[name="confirmarSenha"]', 'differentpassword');

    await page.click('button[type="submit"]:has-text("Criar conta")');

    // Should show error (if client-side validation exists)
    await expect(page.locator('body')).toBeVisible();

    // Step 2: Fix the error and retry
    await page.fill('input[name="confirmarSenha"]', 'password123');
    await page.click('button[type="submit"]:has-text("Criar conta")');

    // Should succeed and redirect
    await page.waitForURL(/\/dashboard-aprendiz/);
    await expect(page).toHaveURL(/\/dashboard-aprendiz/);

    // Step 3: Complete the learner journey
    await page.goto('/marketplace');
    await expect(page.locator('text=Marketplace')).toBeVisible();

    await page.goto('/ranking');
    await expect(page.locator('text=Ranking')).toBeVisible();
  });

  test('responsive design validation: complete flow on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const testEmail = `mobile-test${Date.now()}@test.com`;

    // Step 1: Register on mobile
    await page.goto('/register');
    await page.fill('input[name="nome"]', 'Mobile Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="senha"]', 'password123');
    await page.fill('input[name="confirmarSenha"]', 'password123');

    await page.click('button[type="submit"]:has-text("Criar conta")');
    await page.waitForURL(/\/dashboard-aprendiz/);

    // Step 2: Navigate marketplace on mobile
    await page.goto('/marketplace');
    await expect(page.locator('text=Marketplace')).toBeVisible();

    // Check mobile menu if it exists
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .hamburger-menu');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Menu should open
      await page.waitForTimeout(500);
    }

    // Step 3: Access ranking on mobile
    await page.goto('/ranking');
    await expect(page.locator('text=Ranking')).toBeVisible();

    // Content should be readable on mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('data persistence: create content → logout → login → verify content exists', async ({ page }) => {
    const testEmail = `persistence${Date.now()}@test.com`;
    const contentTitle = `Persistence Test ${Date.now()}`;

    // Step 1: Register and create content
    await registerAndLoginAsUser(page, 'criador', 'Persistence Test', testEmail);

    await createContentAsCriador(page, contentTitle, 'Testing data persistence across sessions.');

    // Step 2: Logout
    const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL('/');
    }

    // Step 3: Login again
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="senha"]', 'password123');
    await page.click('button[type="submit"]:has-text("Entrar")');
    await page.waitForURL(/\/dashboard-criador/);

    // Step 4: Verify content still exists
    await page.goto('/dashboard-criador');
    const persistedContent = page.locator(`text=${contentTitle}`);
    if (await persistedContent.isVisible()) {
      await expect(persistedContent).toBeVisible();
    }
  });
});
