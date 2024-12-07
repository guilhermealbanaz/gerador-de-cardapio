#!/bin/bash

# Modules to comment out
modules=(
    "src/modules/menu"
    "src/modules/restaurant"
    "src/modules/subscription"
    "src/modules/analytics"
    "src/modules/storage"
)

for module in "${modules[@]}"; do
    if [ -d "$module" ]; then
        mv "$module" "${module}_bak"
    fi
done
