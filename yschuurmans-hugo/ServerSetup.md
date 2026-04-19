# Windows Polling Deployment Setup

This document describes a Windows-native deployment flow for the Hugo site.

The server polls GitHub every few minutes, checks whether `origin/main` moved forward, and only then redeploys the Docker-based production container locally. This avoids any public deployment endpoint, webhook listener, or registry push.

## Deployment Model

1. Windows Task Scheduler runs `deployment/windows/poll-and-deploy.ps1` every `X` minutes.
2. The script runs `git fetch origin main` against the server-side deployment clone.
3. If `HEAD` already matches `origin/main`, the script logs `no change` and exits.
4. If `origin/main` is newer, the script acquires a deployment lock.
5. The script resets the deployment clone to `origin/main`.
6. The script runs `docker compose up -d --build yschuurmans-hugo-prod` from the Hugo project directory.
7. On success, the script records the deployed commit SHA and exits.

## Prerequisites

Make sure the server already has the following installed and working:

1. IIS, if it is used to front the production site.
2. Git for Windows.
3. Docker Desktop or another Windows Docker engine that exposes `docker` and `docker compose` to PowerShell.
4. A Windows service account that can run Docker non-interactively.
5. Outbound access from the server to GitHub.

## Recommended Layout

Use a dedicated deployment clone and keep it separate from any interactive developer clone.

Recommended paths:

1. Repository clone: `C:\docker\YSchuurmansPortfolio`
2. State files: `C:\ProgramData\YSchuurmansPortfolio\state`
3. Logs: `C:\ProgramData\YSchuurmansPortfolio\logs`

The repository clone should contain this project at `C:\docker\YSchuurmansPortfolio\yschuurmans-hugo`.

## Service Account

Create a dedicated low-privilege Windows account for automated deployment, for example `svc_portfolio_deploy`.

If this is a local machine account rather than an Active Directory account, refer to it as either `.<backslash>svc_portfolio_deploy` in commands or `<SERVERNAME><backslash>svc_portfolio_deploy`.

Grant this account only the access it needs:

1. Read and write access to the deployment clone.
2. Read and write access to `C:\ProgramData\YSchuurmansPortfolio`.
3. Permission to run `git`.
4. Permission to run `docker` and `docker compose`.
5. Permission to run the scheduled task.

Before relying on automation, sign in or use `runas` to verify that this account can run the following successfully in PowerShell:

```powershell
git --version
docker version
docker compose version
```

## Initial Repository Setup

Clone the repository once on the server:

```powershell
New-Item -ItemType Directory -Force -Path C:\docker | Out-Null
Set-Location C:\docker
git clone <your-repository-url> YSchuurmansPortfolio
```

If the repository is private, configure Git authentication for this clone before continuing.

Then verify the compose-based production deployment works manually:

```powershell
Set-Location C:\docker\YSchuurmansPortfolio\yschuurmans-hugo
docker compose up -d --build yschuurmans-hugo-prod
```

Do not automate anything until this manual deployment succeeds.

By default, the production container is exposed on `http://localhost:28080` so IIS can keep ownership of ports 80 and 443 and reverse proxy to the container.

## Script Files

This repository includes three Windows deployment scripts:

1. `deployment/windows/poll-and-deploy.ps1`
2. `deployment/windows/rollback.ps1`
3. `deployment/windows/register-polling-task.ps1`

All scripts assume they are run from within the checked-out repository and derive paths from their own location by default.

## Polling Script Behavior

`poll-and-deploy.ps1` performs the following steps:

1. Resolves the Git root and Hugo project root.
2. Creates the log and state directories if they do not exist.
3. Acquires a lock file to prevent overlapping deployments.
4. Runs `git fetch origin main --prune`.
5. Compares local `HEAD` with `origin/main`.
6. If unchanged, writes a log entry and exits.
7. If changed, resets the deployment clone to `origin/main`.
8. Stops and removes the existing `yschuurmans-hugo-prod` container, if present.
9. Runs `docker compose up -d --build yschuurmans-hugo-prod`.
10. Writes the deployed commit SHA to a state file.

The script uses `git reset --hard origin/main`. That is intentional and safe only because this should be a dedicated deployment clone.

## Manual Test Run

Run the polling script manually once before registering the scheduled task:

```powershell
Set-Location C:\docker\YSchuurmansPortfolio\yschuurmans-hugo
.\deployment\windows\poll-and-deploy.ps1
```

Review the logs in `C:\ProgramData\YSchuurmansPortfolio\logs`.

## Register the Scheduled Task

You can register the scheduled task with the helper script.

### Option A: run it as the current Windows user

If you are running PowerShell as an administrator and you are happy for the task to run as your current Windows account, use this simpler path:

```powershell
Set-Location C:\docker\YSchuurmansPortfolio\yschuurmans-hugo
.\deployment\windows\register-polling-task.ps1 -CurrentUser -IntervalMinutes 5
```

This is the easiest setup, but it has an important tradeoff: the task is registered as an interactive task for the current user, so it is best suited to scenarios where that user context is expected to remain available.

### Option B: run it as a dedicated service account

If you want the polling task to run under a dedicated deployment account independent of your own login session, use a credential:

```powershell
Set-Location C:\docker\YSchuurmansPortfolio\yschuurmans-hugo
$credential = Get-Credential '.\svc_portfolio_deploy'
.\deployment\windows\register-polling-task.ps1 -Credential $credential -IntervalMinutes 5
```

Both options create a task that runs every 5 minutes and executes the polling script with PowerShell.

If you are using an Active Directory account instead of a local machine account, replace the username with the real domain-qualified identity, for example `YOURDOMAIN\svc_portfolio_deploy`.

If you prefer to create the task manually, use these settings:

1. Run whether user is logged on or not.
2. Use the dedicated deployment service account.
3. Run with the lowest privileges that still allow Docker to work.
4. Repeat task every 5 minutes indefinitely.
5. Start in `C:\docker\YSchuurmansPortfolio\yschuurmans-hugo`.

## Logging

The scripts write timestamped log lines to:

1. `C:\ProgramData\YSchuurmansPortfolio\logs\poll-and-deploy.log`
2. `C:\ProgramData\YSchuurmansPortfolio\logs\rollback.log`

The currently deployed commit is written to:

1. `C:\ProgramData\YSchuurmansPortfolio\state\deployed-sha.txt`

The deployment lock file lives at:

1. `C:\ProgramData\YSchuurmansPortfolio\state\deploy.lock`

## Rollback

Rollback uses the same deployment path, but with an explicit target commit.

Example:

```powershell
Set-Location C:\docker\YSchuurmansPortfolio\yschuurmans-hugo
.\deployment\windows\rollback.ps1 -CommitSha <known-good-commit>
```

That script:

1. Acquires the same deployment lock.
2. Fetches from origin.
3. Resets the deployment clone to the requested commit SHA.
4. Runs `docker compose up -d --build yschuurmans-hugo-prod`.
5. Updates `deployed-sha.txt`.

## Verification Checklist

1. Manual compose deployment works.
2. The deployment service account can run Git and Docker from PowerShell.
3. The polling script exits quickly when nothing changed.
4. A harmless push to `main` is detected on the next polling interval.
5. The container rebuild succeeds and the updated site is served.
6. The scheduled task does not overlap with itself.
7. Rollback succeeds for a known-good commit.

## Operational Notes

1. Keep the deployment clone clean and do not edit files there manually.
2. Do not run the polling script against a normal developer working copy.
3. Polling every 5 minutes is a good default.
4. This flow intentionally allows downtime during rebuild and restart.
5. IIS does not need any extra deployment endpoint for this approach.
6. The production container should stay behind IIS on host port 28080 rather than binding directly to port 80.
