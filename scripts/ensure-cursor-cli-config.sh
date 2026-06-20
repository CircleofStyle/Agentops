#!/usr/bin/env bash
# Repair ~/.cursor/cli-config.json state before Cursor agent runs.
# Prevents ENOENT rename failures when concurrent Paperclip heartbeats race on config writes.
set -euo pipefail

CURSOR_DIR="${CURSOR_HOME:-$HOME/.cursor}"
CONFIG="$CURSOR_DIR/cli-config.json"
TMP="$CONFIG.tmp"
BAD="$CONFIG.bad"
LOCK="$CURSOR_DIR/.cli-config.lock"

mkdir -p "$CURSOR_DIR"

exec 9>"$LOCK"
if ! flock -w 30 9; then
  echo "ensure-cursor-cli-config: timed out waiting for ${LOCK}" >&2
  exit 1
fi

json_valid() {
  python3 -m json.tool "$1" >/dev/null 2>&1
}

# Drop stale tmp when the final config already exists (racing writer leftover).
if [[ -f "$CONFIG" && -f "$TMP" ]]; then
  rm -f "$TMP"
fi

# Quarantine corrupt final config; restore from .bad when it is valid JSON.
if [[ -f "$CONFIG" ]] && ! json_valid "$CONFIG"; then
  mv -f "$CONFIG" "${CONFIG}.corrupt.$(date +%s)" 2>/dev/null || rm -f "$CONFIG"
  if [[ -f "$BAD" ]] && json_valid "$BAD"; then
    cp "$BAD" "$CONFIG"
  fi
fi

# Remove corrupt .bad backups that break recovery.
if [[ -f "$BAD" ]] && ! json_valid "$BAD"; then
  rm -f "$BAD"
fi

# Seed a minimal config when missing so Cursor can complete its atomic update.
if [[ ! -f "$CONFIG" ]]; then
  cat >"$CONFIG" <<'EOF'
{
  "permissions": {
    "allow": ["Shell(**)"],
    "deny": []
  },
  "version": 1,
  "approvalMode": "allowlist",
  "sandbox": {
    "mode": "disabled",
    "networkAccess": "user_config_with_defaults"
  }
}
EOF
fi
