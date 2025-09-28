## MCP Rules: Clean, Effective Playwright Testing

### 1) Project structure
- tests/ for specs; fixtures/ for shared setup; pages/ for page objects; utils/ for helpers; test-data/ for data.
- One happy-path per spec; group variants via parametrization or nearby tests.

### 2) Naming and organization
- Files: featureName.action.spec.ts (e.g., saucedemo.checkout.spec.ts)
- Tests: it('does X when Y')—clear, outcome-focused
- Tags: use annotations (e.g., describe('@smoke', ...))

### 3) Selectors
- Prefer accessible selectors: getByRole, getByLabel, getByPlaceholder
- Avoid brittle CSS/xpath unless stable data-test ids exist; use data-testid when needed
- Keep selectors centralized in page objects

### 4) Test design
- Arrange → Act → Assert with a single clear outcome per test
- Move setup into fixtures/page objects; keep tests lean
- Tests independent: no order assumptions or shared mutable state

### 5) Page Object Model (POM)
- One class per page with explicit methods (loginAs, addItemToCart, checkout)
- Keep assertions in tests (except element presence); POM returns locators or performs actions

### 6) Fixtures and auth
- Use test.extend for common setup
- Reuse storage state for authenticated flows via a dedicated setup step

### 7) Test data
- Deterministic, minimal, local to tests; constants in test-data/
- Randomize only when uniqueness required; seed where possible

### 8) Network and isolation
- Real network for E2E; mock only upstream instabilities
- Use page.route for targeted mocks; avoid over-mocking core flows

### 9) Assertions
- Use toHaveURL, toBeVisible, toContainText with sensible timeouts
- Assert user-visible outcomes, not implementation details

### 10) Waits and timeouts
- No manual sleeps; rely on auto-wait and locator expectations
- Keep global timeouts sane; override per assertion only when justified

### 11) Flake control
- Idempotent steps, stable selectors, deterministic data
- Retries only on CI; fix root causes locally

### 12) Artifacts and reporting
- Enable trace on retry; keep screenshots/videos on failure
- HTML reporter locally; publish artifacts in CI

### 13) Environments and config
- Use baseURL and env-specific config (playwright.config.*.ts)
- No secrets in code; use .env and CI secrets

### 14) Parallelism
- Ensure parallel safety; avoid shared globals and unguarded file I/O
- Tune workers for CI resources

### 15) Security and compliance
- Never log secrets; scrub traces/logs
- Use least-privileged test users

### 16) Code quality
- Strong typing, readable names, early returns, minimal nesting
- Small, cohesive PRs; include rationale in commits

### 17) Teaching and workflow cadence
- Plan → scaffold files → add fixtures/POM → write tests → run locally → stabilize → document
- After each change: run targeted spec, review trace on failures, refine

### 18) Run commands
- All tests: `npm run test:e2e`
- Single spec: `npm run test:e2e -- tests/saucedemo.spec.ts`
- UI mode: `npm run test:e2e:ui`
- Report: `npm run test:e2e:report`

Reference system under test: `https://www.saucedemo.com/`


