# Deploying LLM Advisor to Azure App Service

This guide covers two deploy paths:

- **Path A** — GitHub Actions auto-deploy (recommended, hands-free after setup).
- **Path B** — One-off manual push with the Azure CLI.

Both paths target **Azure App Service on Linux with Node 20 LTS**.

---

## 0. What Azure needs

This is a Next.js 14 server app, not a static export. It must run the Node process that ships with `next start`, so Azure App Service (not Static Web Apps) is the right home.

## 1. Create the App Service

1. In the Azure Portal, **Create a resource → Web App**.
2. Fill in:
   - **Resource Group**: `rg-llm-advisor` (or re-use an existing one)
   - **Name**: `llm-advisor` (will become `llm-advisor.azurewebsites.net`)
   - **Publish**: **Code**
   - **Runtime stack**: **Node 20 LTS**
   - **Operating System**: **Linux**
   - **Region**: pick the closest to you
   - **Pricing plan**: **Basic B1** is enough for demo traffic. Free F1 also works but cold-starts hard.
3. Review + Create. Wait ∼2 minutes for provisioning.

## 2. Configure application settings (environment variables)

In the new App Service blade → **Settings → Environment variables → Application settings**, add:

| Name | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-REF.supabase.co` | Public, prefixed `NEXT_PUBLIC_` so it reaches the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Public anon key from Supabase → Settings → API. |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOi...` | **Server-only**. Never exposed to the browser. |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` | Tells Oryx to run `yarn install && yarn build` on deploy. |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` | Pin Node version. |
| `NEXTAUTH_URL` | `https://llm-advisor.azurewebsites.net` | Optional today; used by future auth PBI. |

Click **Apply** — the app restarts automatically.

## 3. Set the startup command

In **Settings → Configuration → General settings**:

- **Stack**: Node
- **Major version**: Node 20
- **Minor version**: Latest
- **Startup Command**: `cd nextjs_space && yarn start`

> The app’s Next.js code lives in the `nextjs_space` subdirectory, so we change to it before running `yarn start`.

Save.

---

## Path A — GitHub Actions auto-deploy

Once PBI 7 pushes the repo to `johnkirima/llm-advisor`:

1. In the Azure Portal → App Service → **Deployment → Deployment Center**.
2. Source: **GitHub**. Authorize, then pick the `johnkirima/llm-advisor` repo and the `main` branch.
3. Runtime: **Node 20**. Build provider: **GitHub Actions**.
4. Click **Save**. Azure writes a workflow file to `.github/workflows/` in your repo and kicks off the first deploy.
5. Watch the run in **Actions** — it should: checkout → `yarn install` → `yarn build` → zip → deploy.

When the run finishes (∼6 minutes the first time), visit `https://llm-advisor.azurewebsites.net` and hit `/decision`.

## Path B — Azure CLI one-off deploy

From a local checkout of the repo:

```bash
# 1. sign in
az login

# 2. pick a subscription if you have more than one
az account set --subscription "<subscription-name-or-id>"

# 3. deploy
cd llm-advisor
az webapp up \
  --name llm-advisor \
  --resource-group rg-llm-advisor \
  --runtime NODE:20-lts \
  --os-type Linux \
  --location "Central US" \
  --plan llm-advisor-plan \
  --sku B1
```

This packages the working directory, pushes to Azure, and runs the Oryx build. Output ends with the live URL.

---

## 4. Post-deploy smoke test

```bash
curl -I https://llm-advisor.azurewebsites.net
curl -I https://llm-advisor.azurewebsites.net/decision
curl -X POST https://llm-advisor.azurewebsites.net/api/sessions
# → {"sessionId":"..."}
```

If all three return 200/JSON, the full workflow is live.

## 5. Troubleshooting

| Symptom | Fix |
| --- | --- |
| App loads but `/api/sessions` returns 500 | Check **Log stream**. Usually a missing env var — reopen **Environment variables**, confirm the three Supabase keys, Apply & restart. |
| `Error: Cannot find module 'next'` | Build didn’t run. Verify `SCM_DO_BUILD_DURING_DEPLOYMENT=true` is set, then restart. |
| Slow first load after idle | Free/Basic tiers sleep. Bump to Standard S1 or enable **Always On**. |
| 403 from Supabase | The `SUPABASE_SERVICE_KEY` is wrong or got pasted with whitespace. Re-copy from Supabase and re-apply. |

---

## 6. Rollback

Deployment Center → **Logs** tab shows every deploy. Click any previous green run and hit **Redeploy**.
