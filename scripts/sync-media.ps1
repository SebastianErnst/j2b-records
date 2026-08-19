<#
.SYNOPSIS
    Mirrors production media files (public/uploads) from the FTP server to the local project.

.DESCRIPTION
    Uses the WinSCP .NET assembly to download new/changed files from the remote
    "public/uploads" directory into the local "public/uploads" directory.
    Only downloads new or changed files by default (safe, non-destructive).

    Credentials are never hardcoded in this file. On first run you will be prompted
    for the FTP password and can optionally save it as a DPAPI-encrypted file that
    only your Windows user account on this machine can decrypt (scripts/.ftp-credential.xml).

.PARAMETER RemotePath
    Remote directory to mirror from. Defaults to /public/uploads.

.PARAMETER LocalPath
    Local directory to mirror into. Defaults to <project root>/public/uploads.

.PARAMETER Mirror
    If set, also deletes local files that no longer exist on the server.
    Off by default to avoid accidental data loss.

.PARAMETER Ftps
    Use explicit FTPS (FTP over TLS) instead of plain FTP. Try this if plain
    FTP login fails, since many hosting providers now require encryption.

.PARAMETER AcceptAnyTlsCertificate
    Accept any FTPS certificate (insecure). Use only for a first connectivity
    test, then switch to a fixed fingerprint in .vscode/sftp.json.

.EXAMPLE
    .\scripts\sync-media.ps1

.EXAMPLE
    .\scripts\sync-media.ps1 -RemotePath /public/uploads -Mirror

.EXAMPLE
    .\scripts\sync-media.ps1 -Ftps

.EXAMPLE
    .\scripts\sync-media.ps1 -Ftps -AcceptAnyTlsCertificate

.EXAMPLE
    .\scripts\sync-media.ps1 -FromClipboard
#>

param(
    [string]$RemotePath = '/public/uploads',
    [string]$LocalPath = (Join-Path $PSScriptRoot '..\public\uploads'),
    [switch]$Mirror,
    [switch]$Ftps,
    [switch]$AcceptAnyTlsCertificate,
    [switch]$FromClipboard
)

$ErrorActionPreference = 'Stop'

$sftpConfigPath = Join-Path $PSScriptRoot '..\.vscode\sftp.json'
$credentialPath = Join-Path $PSScriptRoot '.ftp-credential.xml'
$winscpDll = Join-Path $env:LOCALAPPDATA 'Programs\WinSCP\WinSCPnet.dll'

if (-not (Test-Path $sftpConfigPath)) {
    throw "Konnte $sftpConfigPath nicht finden."
}
if (-not (Test-Path $winscpDll)) {
    throw "WinSCP .NET Assembly nicht gefunden unter $winscpDll. Bitte WinSCP installieren: winget install -e --id WinSCP.WinSCP"
}

$sftpConfig = Get-Content $sftpConfigPath -Raw | ConvertFrom-Json

Add-Type -Path $winscpDll

# Load a saved encrypted credential, unless a fresh clipboard password was requested.
if ($FromClipboard) {
    $plainFromClipboard = Get-Clipboard
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.Clipboard]::Clear()
    $securePassword = ConvertTo-SecureString -String $plainFromClipboard -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential($sftpConfig.username, $securePassword)
    Write-Output 'Passwort aus der Zwischenablage uebernommen (Zwischenablage anschliessend geleert).'
} else {
    if (Test-Path $credentialPath) {
        $credential = Import-Clixml $credentialPath
    } else {
        $securePassword = Read-Host -Prompt "FTP-Passwort fuer $($sftpConfig.username)@$($sftpConfig.host)" -AsSecureString
        $credential = New-Object System.Management.Automation.PSCredential($sftpConfig.username, $securePassword)

        $save = Read-Host -Prompt 'Passwort verschluesselt fuer dieses Windows-Konto speichern, damit das Script kuenftig automatisch laufen kann? (j/N)'
        if ($save -eq 'j') {
            $credential | Export-Clixml $credentialPath
            Write-Output "Gespeichert unter $credentialPath (nur mit diesem Windows-Konto auf diesem Rechner entschluesselbar)."
        }
    }
}

$ftpModes = if ($Ftps) {
    @([WinSCP.FtpSecure]::Explicit)
} else {
    @([WinSCP.FtpSecure]::None, [WinSCP.FtpSecure]::Explicit)
}

$connected = $false
$lastError = $null
$session = New-Object WinSCP.Session

try {
    foreach ($mode in $ftpModes) {
        $sessionOptions = New-Object WinSCP.SessionOptions
        $sessionOptions.Protocol = [WinSCP.Protocol]::Ftp
        $sessionOptions.HostName = $sftpConfig.host
        $sessionOptions.PortNumber = $sftpConfig.port
        $sessionOptions.UserName = $credential.UserName
        $sessionOptions.Password = $credential.GetNetworkCredential().Password
        $sessionOptions.FtpSecure = $mode

        if ($mode -eq [WinSCP.FtpSecure]::Explicit) {
            if ($sftpConfig.PSObject.Properties.Name -contains 'tlsHostCertificateFingerprint' -and $sftpConfig.tlsHostCertificateFingerprint) {
                $sessionOptions.TlsHostCertificateFingerprint = $sftpConfig.tlsHostCertificateFingerprint
            } elseif ($AcceptAnyTlsCertificate) {
                $unsafeTlsProperty = $sessionOptions.GetType().GetProperty('GiveUpSecurityAndAcceptAnyTlsHostCertificate')
                if ($null -ne $unsafeTlsProperty) {
                    $unsafeTlsProperty.SetValue($sessionOptions, $true)
                }
            }
        }

        try {
            Write-Output "Verbindungsversuch: FTP-Sicherheit = $mode"
            $session.Open($sessionOptions)
            $connected = $true
            break
        } catch {
            $lastError = $_
            Write-Output "Verbindung fehlgeschlagen fuer Modus $mode : $($_.Exception.Message)"
        }
    }

    if (-not $connected) {
        throw "Login fehlgeschlagen. Bei 'Partnerzertifikat abgelehnt' einmal mit -Ftps -AcceptAnyTlsCertificate testen und danach den Fingerprint als 'tlsHostCertificateFingerprint' in .vscode/sftp.json eintragen. Gespeicherte Zugangsdaten kannst du mit 'Remove-Item scripts/.ftp-credential.xml' loeschen und neu eingeben. Letzter Fehler: $($lastError.Exception.Message)"
    }

    if (-not (Test-Path $LocalPath)) {
        New-Item -ItemType Directory -Path $LocalPath -Force | Out-Null
    }

    $result = $session.SynchronizeDirectories([WinSCP.SynchronizationMode]::Local, $LocalPath, $RemotePath, $Mirror.IsPresent)
    $result.Check()

    Write-Output "Fertig. Heruntergeladen: $($result.Downloads.Count) Datei(en)."
    foreach ($download in $result.Downloads) {
        Write-Output "  + $($download.FileName)"
    }
} finally {
    $session.Dispose()
}
