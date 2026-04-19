[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$CommitSha,
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

$logPath = Join-Path $LogDir "rollback.log"
$lockPath = Join-Path $StateDir "deploy.lock"
$deployedShaPath = Join-Path $StateDir "deployed-sha.txt"
$buildDataPath = Join-Path $SiteRoot "data\build.toml"
$publicDirPath = Join-Path $SiteRoot "public"

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

function Write-BuildMetadata {
    param([string]$CommitSha)

    $versionNumber = (& $gitExe rev-list --count $CommitSha).Trim()
    $commitDate = (& $gitExe show -s --format=%cs $CommitSha).Trim()
    $buildDataDir = Split-Path -Parent $buildDataPath
    $buildData = @(
        "version = `"$versionNumber`""
        "date = `"$commitDate`""
        "commit = `"$CommitSha`""
    )

    $null = New-Item -ItemType Directory -Force -Path $buildDataDir
    Set-Content -Path $buildDataPath -Value $buildData
    Write-Log "Wrote build metadata version $versionNumber for $commitDate."
}

function Reset-PublicDirectory {
    if (-not (Test-Path -Path $publicDirPath)) {
        Write-Log "No existing public directory found at $publicDirPath."
        return
    }

    Write-Log "Removing existing public directory at $publicDirPath."
    Remove-Item -Path $publicDirPath -Recurse -Force
}

function Reset-ProdContainer {
    $existingContainerId = & $dockerExe compose @composeOptions ps -a -q $prodServiceName | Select-Object -First 1

    if ([string]::IsNullOrWhiteSpace($existingContainerId)) {
        Write-Log "No existing $prodServiceName container found."
        return
    }

    $existingContainerId = $existingContainerId.Trim()

    Write-Log "Stopping and removing existing $prodServiceName container $existingContainerId."
    & $dockerExe compose @composeOptions rm -f -s $prodServiceName | Out-Null
}

$gitExe = Get-CommandPath -Name "git"
$dockerExe = Get-CommandPath -Name "docker"
$composeFilePath = Join-Path $SiteRoot "docker-compose.yml"
$composeOptions = @("--project-directory", $SiteRoot, "--file", $composeFilePath)
$prodServiceName = "yschuurmans-hugo-prod"

$lockStream = $null

try {
    try {
        $lockStream = New-Object System.IO.FileStream($lockPath, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
    }
    catch [System.IO.IOException] {
        Write-Log "Another deployment is already in progress. Exiting."
        exit 1
    }

    Push-Location $GitRoot

    Write-Log "Fetching origin before rollback."
    & $gitExe fetch origin --prune | Out-Null

    Write-Log "Rolling back to $CommitSha."
    & $gitExe rev-parse --verify $CommitSha | Out-Null
    & $gitExe reset --hard $CommitSha | Out-Null

    Pop-Location
    Push-Location $SiteRoot

    Write-BuildMetadata -CommitSha $CommitSha
    Reset-PublicDirectory

    Reset-ProdContainer

    Write-Log "Running docker compose up -d --build $prodServiceName for rollback."
    & $dockerExe compose @composeOptions up -d --build $prodServiceName

    Set-Content -Path $deployedShaPath -Value $CommitSha
    Write-Log "Rollback completed successfully at $CommitSha."
}
catch {
    Write-Log "Rollback failed: $($_.Exception.Message)"
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
