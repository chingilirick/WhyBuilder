#!/bin/bash
echo "=== PROJECT STRUCTURE ==="
tree -I 'node_modules|venv|__pycache__|migrations|.git|dist|build|__pycache__' -L 4

echo ""
echo "=== BACKEND: properties/models.py ==="
cat properties/models.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: properties/views.py ==="
cat properties/views.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: properties/serializers.py ==="
cat properties/serializers.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: properties/urls.py ==="
cat properties/urls.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: whybuilder_api/settings.py ==="
cat whybuilder_api/settings.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: whybuilder_api/urls.py ==="
cat whybuilder_api/urls.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: users/models.py ==="
cat users/models.py 2>/dev/null || echo "File not found"

echo ""
echo "=== BACKEND: landlord/models.py ==="
cat landlord/models.py 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/App.tsx ==="
cat frontend/src/app/App.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/routes.tsx ==="
cat frontend/src/app/routes.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/pages/Home.tsx ==="
cat frontend/src/app/pages/Home.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/pages/Browse.tsx ==="
cat frontend/src/app/pages/Browse.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/pages/PropertyDetail.tsx ==="
cat frontend/src/app/pages/PropertyDetail.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/pages/LandlordDashboard.tsx ==="
cat frontend/src/app/pages/LandlordDashboard.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/components/PropertyCard.tsx ==="
cat frontend/src/app/components/PropertyCard.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/app/components/Header.tsx ==="
cat frontend/src/app/components/Header.tsx 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/lib/api.ts ==="
cat frontend/src/lib/api.ts 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: src/styles/index.css ==="
cat frontend/src/styles/index.css 2>/dev/null || echo "File not found"

echo ""
echo "=== FRONTEND: package.json ==="
cat frontend/package.json 2>/dev/null || echo "File not found"

echo ""
echo "=== REQUIREMENTS.TXT ==="
cat requirements.txt 2>/dev/null || echo "File not found"

echo ""
echo "=== MANAGE.PY ==="
cat manage.py 2>/dev/null || echo "File not found"
