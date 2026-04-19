[CmdletBinding()]
param(
    [string]$GitRoot,
    [string]$SiteRoot,
    [string]$StateDir = (Join-Path $env:ProgramData "YSchuurmansPortfolio\state"),
    [string]$LogDir = (Join-Path $env:ProgramData "YSchuurmansPortfolio\logs")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $GitRoot) {
    $GitRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\..\.."))
}

if (-not $SiteRoot) {
    $SiteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
}

$null = New-Item -ItemType Directory -Force -Path $StateDir
$null = New-Item -ItemType Directory -Force -Path $LogDir

$logPath = Join-Path $LogDir "poll-and-deploy.log"
$lockPath = Join-Path $StateDir "deploy.lock"
$deployedShaPath = Join-Path $StateDir "deployed-sha.txt"

function Write-Log {
    param([string]$Message)

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] $Message"
    Add-Content -Path $logPath -Value $line
    Write-Output $line
}

function Get-CommandPath {
    param([string]$Name)

    $command = Get-Command $Name -ErrorAction Stop
    return $command.Source
}

$gitExe = Get-CommandPath -Name "git"
$dockerExe = Get-CommandPath -Name "docker"

$lockStream = $null

try {
    try {
        $lockStream = New-Object System.IO.FileStream($lockPath, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
    }
    catch [System.IO.IOException] {
        Write-Log "Another deployment is already in progress. Exiting."
        exit 0
    }

    Push-Location $GitRoot

    Write-Log "Fetching origin/main."
    & $gitExe fetch origin main --prune | Out-Null

    $currentSha = (& $gitExe rev-parse HEAD).Trim()
    $remoteSha = (& $gitExe rev-parse origin/main).Trim()

    if ($currentSha -eq $remoteSha) {
        Write-Log "No change detected. HEAD already matches origin/main at $currentSha."
        exit 0
    }

    Write-Log "Change detected. Deploying $remoteSha over $currentSha."
    & $gitExe reset --hard origin/main | Out-Null

    Pop-Location
    Push-Location $SiteRoot

    Write-Log "Running docker compose up -d --build prod."
    & $dockerExe compose up -d --build prod

    Set-Content -Path $deployedShaPath -Value $remoteSha
    Write-Log "Deployment completed successfully at $remoteSha."
}
catch {
    Write-Log "Deployment failed: $($_.Exception.Message)"
    throw
}
finally {
    if (Get-Location) {
        Pop-Location -ErrorAction SilentlyContinue
        Pop-Location -ErrorAction SilentlyContinue
    }

    if ($lockStream) {
        $lockStream.Dispose()
    }

    Remove-Item -Path $lockPath -Force -ErrorAction SilentlyContinue
}
