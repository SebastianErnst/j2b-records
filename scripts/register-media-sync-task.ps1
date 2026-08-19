<#
.SYNOPSIS
    Registers a Windows daily scheduled task that runs sync-media.ps1 automatically.

.DESCRIPTION
    Run this once (as your normal user, no admin required for a per-user task).
    Requires that sync-media.ps1 has already been run manually once with -Save
    confirmed ("j"), so the encrypted credential file exists and no prompt is needed.

.PARAMETER Time
    Daily run time, 24h format. Defaults to 06:00.
#>

param(
    [string]$Time = '06:00'
)

$ErrorActionPreference = 'Stop'

$scriptPath = Join-Path $PSScriptRoot 'sync-media.ps1'
$credentialPath = Join-Path $PSScriptRoot '.ftp-credential.xml'

if (-not (Test-Path $credentialPath)) {
    throw "Kein gespeichertes Passwort gefunden. Bitte zuerst '.\sync-media.ps1' manuell ausfuehren und beim Speichern mit 'j' bestaetigen."
}

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable

Register-ScheduledTask -TaskName 'J2B-Records-Media-Sync' `
    -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

Write-Output "Taeglicher Task 'J2B-Records-Media-Sync' um $Time Uhr eingerichtet."
