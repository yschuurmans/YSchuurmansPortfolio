[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, ParameterSetName = "Credential")]
    [PSCredential]$Credential,
    [Parameter(Mandatory = $true, ParameterSetName = "CurrentUser")]
    [switch]$CurrentUser,
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

function Resolve-TaskUserName {
    param([string]$Name)

    if ([string]::IsNullOrWhiteSpace($Name)) {
        throw "UserName must not be empty."
    }

    if ($Name -match '^[^\\@]+$') {
        return "$env:COMPUTERNAME\$Name"
    }

    if ($Name.StartsWith('.\')) {
        return "$env:COMPUTERNAME\$($Name.Substring(2))"
    }

    return $Name
}

function Test-ResolvableAccount {
    param([string]$Name)

    try {
        $account = New-Object System.Security.Principal.NTAccount($Name)
        $null = $account.Translate([System.Security.Principal.SecurityIdentifier])
        return $true
    }
    catch {
        return $false
    }
}

function ConvertTo-PlainText {
    param([SecureString]$Value)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)

    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
        }
    }
}

if (-not $WorkingDirectory) {
    $WorkingDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
}

if ($PSCmdlet.ParameterSetName -eq "CurrentUser") {
    $userName = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    $password = $null
}
else {
    $userName = $Credential.UserName
    $password = $Credential.Password
}

$resolvedUserName = Resolve-TaskUserName -Name $userName

if (-not (Test-ResolvableAccount -Name $resolvedUserName)) {
    throw @"
The account '$userName' could not be resolved on this machine.

Use one of these forms:
- local account: '.\svc_portfolio_deploy'
- local account: '$env:COMPUTERNAME\svc_portfolio_deploy'
- domain account: 'YOURDOMAIN\svc_portfolio_deploy'

If you intended to use a local service account, make sure it already exists on the server.
"@
}

$scriptPath = Join-Path $PSScriptRoot "poll-and-deploy.ps1"
$taskCommand = "cmd /c cd /d `"$WorkingDirectory`" && `"$PowerShellPath`" -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

$arguments = @(
    "/Create"
    "/TN", $TaskName
    "/TR", $taskCommand
    "/SC", "MINUTE"
    "/MO", $IntervalMinutes
    "/RU", $resolvedUserName
    "/F"
)

if ($PSCmdlet.ParameterSetName -eq "CurrentUser") {
    $arguments += "/IT"
}
else {
    $plainTextPassword = ConvertTo-PlainText -Value $password
    $arguments += @("/RP", $plainTextPassword)
}

& schtasks.exe @arguments

if ($LASTEXITCODE -ne 0) {
    throw "schtasks.exe failed with exit code $LASTEXITCODE while registering task '$TaskName' for '$resolvedUserName'."
}
