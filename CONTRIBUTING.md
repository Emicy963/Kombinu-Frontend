# Contributing to Kombinu Frontend

We welcome contributions to the Kombinu Frontend!

## 🌳 Branching Strategy

**IMPORTANT**:

- **DO NOT** make Pull Requests directly to the `main` branch.
- All functional changes, features, and fixes must be submitted to the **`develop`** branch.
- The `main` branch is reserved for stable, production-ready releases only.

### Workflow

1. Create your feature branch from `develop`:

   ```bash
   git checkout develop
   git checkout -b feature/amazing-new-feature
   ```

2. Implement your changes.
3. Verify that the build passes: `npm run build`.
4. Open a Pull Request targeting `develop`.

## 📝 Coding Standards

- **TypeScript**: Use strict typing. Avoid `any` whenever possible.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline `style={{}}` attributes.
- **Components**: Prefer functional components and Hooks.
- **State**: Use React Context for global state (Auth, Theme) and local state for component logic.
