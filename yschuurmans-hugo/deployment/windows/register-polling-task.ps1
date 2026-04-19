[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$UserName,
    [Parameter(Mandatory = $true)]
    [string]$Password,
    [int]$IntervalMinutes = 5,
    [string]$TaskName = "YSchuurmans Portfolio Polling Deploy",
    [string]$WorkingDirectory,
    [string]$PowerShellPath = "powershell.exe"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ($IntervalMinutes -lt 1) {
    throw "IntervalMinutes must be 1 or greater."
}

if (-not $WorkingDirectory) {
    $WorkingDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
}

$scriptPath = Join-Path $PSScriptRoot "poll-and-deploy.ps1"
$taskCommand = "cmd /c cd /d `"$WorkingDirectory`" && `"$PowerShellPath`" -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

$arguments = @(
    "/Create"
    "/TN", $TaskName
    "/TR", $taskCommand
    "/SC", "MINUTE"
    "/MO", $IntervalMinutes
    "/RU", $UserName
    "/RP", $Password
    "/F"
)

& schtasks.exe @arguments

if ($LASTEXITCODE -ne 0) {
    throw "schtasks.exe failed with exit code $LASTEXITCODE."
}
