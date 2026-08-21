#!/usr/bin/env bash
#
# Mirrors production media files (public/uploads) from the FTP server to the
# local project. Uses wget to download new/changed files (safe, non-destructive:
# existing local files that no longer exist on the server are kept).
#
# Reads host/username/remote root from .vscode/sftp.json (same file used by
# the VS Code SFTP extension and by scripts/sync-media.ps1 on Windows).
#
# Usage:
#   scripts/sync-media.sh [remote-path] [--ftps]
#
# Arguments:
#   remote-path   Path (relative to the project root) to mirror.
#                 Defaults to /public/uploads.
#   --ftps        Use explicit FTPS (FTP over TLS) instead of plain FTP.
#
# Examples:
#   scripts/sync-media.sh
#   scripts/sync-media.sh /public/uploads/media
#   scripts/sync-media.sh /public/uploads --ftps
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SFTP_CONFIG="$PROJECT_ROOT/.vscode/sftp.json"

REMOTE_SUFFIX="/public/uploads"
SCHEME="ftp"

for arg in "$@"; do
    case "$arg" in
        --ftps) SCHEME="ftps" ;;
        *) REMOTE_SUFFIX="$arg" ;;
    esac
done

if [ ! -f "$SFTP_CONFIG" ]; then
    echo "Konnte $SFTP_CONFIG nicht finden." >&2
    exit 1
fi

HOST=$(grep -oP '"host":\s*"\K[^"]+' "$SFTP_CONFIG")
FTP_USER=$(grep -oP '"username":\s*"\K[^"]+' "$SFTP_CONFIG")
REMOTE_ROOT=$(grep -oP '"remotePath":\s*"\K[^"]+' "$SFTP_CONFIG")

REMOTE_FULL_PATH="${REMOTE_ROOT}${REMOTE_SUFFIX}"
LOCAL_PATH="$PROJECT_ROOT${REMOTE_SUFFIX}"
# Number of leading path segments to strip so files land directly under LOCAL_PATH.
CUT_DIRS=$(echo -n "$REMOTE_FULL_PATH" | tr -cd '/' | wc -c)

mkdir -p "$LOCAL_PATH"

echo "Synce ${SCHEME}://${HOST}${REMOTE_FULL_PATH}/ -> ${LOCAL_PATH}"

wget -r -N -np -nH --cut-dirs="$CUT_DIRS" \
    --user="$FTP_USER" --ask-password \
    -P "$LOCAL_PATH" \
    "${SCHEME}://${HOST}${REMOTE_FULL_PATH}/"

echo "Fertig."
