# Jenkins Setup Guide

## Required Jenkins Plugins

Install these from **Manage Jenkins → Plugins**:

| Plugin | Purpose |
|--------|---------|
| NodeJS Plugin | Run `npm` / `npx` on agents |
| Allure Jenkins Plugin | Render Allure HTML reports in build |
| HTML Publisher Plugin | Publish Playwright HTML report |
| Pipeline | Declarative pipeline support |
| Credentials Binding | Inject secrets as env vars |
| Timestamper | Add timestamps to console output |
| Workspace Cleanup | `cleanWs()` in post block |
| Blue Ocean (optional) | Better pipeline visualization |

---

## NodeJS Tool Configuration

1. **Manage Jenkins → Tools → NodeJS installations**
2. Add installation:
   - Name: `NodeJS-20` *(must match `tools { nodejs 'NodeJS-20' }` in Jenkinsfile)*
   - Version: `20.x`
   - Install automatically: ✅

---

## Credentials Setup

Go to **Manage Jenkins → Credentials → Global → Add Credential** for each:

| ID | Kind | Value |
|----|------|-------|
| `SAUCE_BASE_URL` | Secret text | `https://www.saucedemo.com` |
| `REQRES_API_BASE_URL` | Secret text | `https://reqres.in/api` |
| `SAUCE_STANDARD_USER` | Secret text | `standard_user` |
| `SAUCE_USER_PASSWORD` | Secret text | `secret_sauce` |
| `SAUCE_LOCKED_USER` | Secret text | `locked_out_user` |
| `SAUCE_PROBLEM_USER` | Secret text | `problem_user` |
| `SAUCE_PERF_GLITCH_USER` | Secret text | `performance_glitch_user` |
| `REQRES_API_KEY` | Secret text | `reqres-free-v1` |

---

## Create the Pipeline Job

### PR / Push Job

1. **New Item → Pipeline**
2. Name: `ecommerce-automation`
3. Under **Pipeline**:
   - Definition: `Pipeline script from SCM`
   - SCM: Git
   - Repository URL: `https://github.com/your-org/ecommerce-automation`
   - Branch: `*/main` (or `*/develop`)
   - Script Path: `jenkins/Jenkinsfile`
4. Save → **Build Now**

### Nightly Job

1. **New Item → Pipeline**
2. Name: `ecommerce-automation-nightly`
3. Same SCM config as above
4. Script Path: `jenkins/Jenkinsfile.nightly`
5. Save — the `cron('0 2 * * *')` trigger inside the file handles scheduling

---

## Allure Plugin Configuration

1. **Manage Jenkins → Configure System → Allure Commandline**
2. Add:
   - Name: `Allure`
   - Install automatically: ✅ (latest version)
3. The `allure([...])` step in the Jenkinsfile will now generate and embed the report in each build.

---

## Viewing Reports After a Build

| Report | Location |
|--------|----------|
| Allure Report | Build page → **Allure Report** link (left sidebar) |
| Playwright HTML | Build page → **Playwright Report** link |
| Screenshots/videos | Build page → **Artifacts** |

---

## Running a Specific Suite Manually

1. Open the `ecommerce-automation` job
2. Click **Build with Parameters**
3. Choose:
   - `TEST_SUITE`: `ui` / `api` / `e2e` / `visual` / `all`
   - `BROWSER`: `chromium` / `firefox` / `webkit` / `all`
   - `RUN_VISUAL`: check to include visual regression

---

## Agent Requirements

Each Jenkins agent must have:
- Ubuntu 20.04+ (or any Debian-based Linux)
- Git
- At least 4GB RAM (Playwright runs 4 workers in parallel)
- Internet access to `saucedemo.com` and `reqres.in`

Playwright browsers are installed fresh on each build via `npx playwright install --with-deps`. This adds ~1 min to build time but guarantees the correct browser binary version.
