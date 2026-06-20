#!/usr/bin/env bash
# Paperclip wrapper for Cursor agent: serialize cli-config updates, then exec agent.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/ensure-cursor-cli-config.sh"
exec agent "$@"
