#!/usr/bin/env sh

set -eu

preview_url="http://localhost:4173"

vite preview --host localhost --port 4173 --strictPort &
server_pid=$!

cleanup() {
  trap - EXIT INT TERM HUP
  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
}

shutdown() {
  cleanup
  exit 0
}

trap cleanup EXIT
trap shutdown INT TERM HUP

until curl --silent --fail --output /dev/null "$preview_url/"; do
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "Vite preview exited before becoming ready." >&2
    exit 1
  fi

  sleep 0.2
done

bun run src/mcp/client.ts
wait "$server_pid"
