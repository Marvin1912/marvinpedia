#!/bin/bash

folder='src/components/markdown'

highest_id=$(grep -h "^id:" "$folder"/*.md 2>/dev/null | awk '{print $2}' | sort -n | tail -1)

if [[ -z "$highest_id" ]]; then
  highest_id=0
fi

new_id=$((highest_id + 1))

read -rp "Name: " name

printf "\n### Existing topics:\n%s\n\n" "$(grep -h "^topic:" src/components/markdown/*.md | awk '{print $2}' | sort | uniq)"
read -rp "Topic: " topic

read -rp "Filename: " fileName
if [[ ! $fileName =~ ^[a-z\-]+$ ]]; then
  echo "Filename is wrong (a-z) and - allowed only."
  exit 1
fi

targetFile="${folder}/$fileName.md"

cat << EOF > "$targetFile"
---
id: $new_id
name: $name
topic: $topic
fileName: $fileName
---
EOF

echo "File $targetFile created:"
cat "$targetFile"
