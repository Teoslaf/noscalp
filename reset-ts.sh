#!/bin/bash

# Reset TypeScript Language Server and Clean All Caches
echo "🔄 Cleaning TypeScript and Next.js caches..."

# Remove Next.js and TypeScript caches
rm -rf .next
rm -rf .tsbuildinfo
rm -rf node_modules/.cache

# Remove any stray TypeScript cache files
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

echo "✅ Cache cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Restart your IDE (VS Code/Cursor)"
echo "2. Reload TypeScript Language Server:"
echo "   - VS Code: Cmd+Shift+P → 'TypeScript: Restart TS Server'"
echo "   - Cursor: Cmd+Shift+P → 'TypeScript: Restart TS Server'"
echo "3. If errors persist, reload the window: Cmd+Shift+P → 'Developer: Reload Window'" 