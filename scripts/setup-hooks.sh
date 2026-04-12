#!/bin/bash
# Install git hooks for secret detection
# Run this after cloning the repo: bash scripts/setup-hooks.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
HOOKS_DIR="$REPO_DIR/.git/hooks"

cp "$SCRIPT_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"

echo "Pre-commit hook installed. Secrets will be blocked before commit."
