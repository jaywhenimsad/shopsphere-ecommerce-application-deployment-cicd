#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 s3://YOUR-BUCKET"
  exit 1
fi
BUCKET="$1"
aws s3 sync "$(dirname "$0")/../frontend/public/assets" "$BUCKET/assets" \
  --exclude "ASSET-MANIFEST.json" \
  --cache-control "public,max-age=31536000,immutable"
echo "Assets uploaded to $BUCKET/assets"
