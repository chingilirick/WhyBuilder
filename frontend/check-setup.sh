#!/bin/bash

echo "========================================="
echo "🔍 WhyBuilder Frontend Setup Check"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        return 1
    fi
}

echo "📁 Checking src/ structure..."
echo "-----------------------------------------"
check_dir "src"
check_dir "src/app"
check_dir "src/app/components"
check_dir "src/app/pages"
check_dir "src/app/context"
check_dir "src/app/hooks"
check_dir "src/context"
check_dir "src/lib"
check_dir "src/styles"

echo ""
echo "📄 Checking core files..."
echo "-----------------------------------------"
check_file "src/main.tsx"
check_file "src/app/App.tsx"
check_file "src/app/routes.tsx"
check_file "src/app/pages/Root.tsx"
check_file "src/app/pages/Home.tsx"
check_file "src/app/pages/Browse.tsx"
check_file "src/app/pages/About.tsx"
check_file "src/app/pages/Auth.tsx"
check_file "src/app/pages/ListingSubmission.tsx"
check_file "src/app/pages/LandlordDashboard.tsx"
check_file "src/app/components/Header.tsx"
check_file "src/app/components/Footer.tsx"
check_file "src/app/components/ProtectedRoute.tsx"
check_file "src/context/ThemeContext.tsx"
check_file "src/context/CurrencyContext.tsx"
check_file "src/lib/api.ts"
check_file "src/lib/auth.ts"
check_file "src/styles/index.css"

echo ""
echo "📦 Checking package.json dependencies..."
echo "-----------------------------------------"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅${NC} package.json found"
    
    # Check for vite
    if grep -q "vite" package.json; then
        echo -e "${GREEN}✅${NC} vite in dependencies"
    else
        echo -e "${RED}❌${NC} vite NOT in dependencies"
    fi
    
    # Check for react-router
    if grep -q "react-router" package.json; then
        echo -e "${GREEN}✅${NC} react-router in dependencies"
    else
        echo -e "${RED}❌${NC} react-router NOT in dependencies"
    fi
else
    echo -e "${RED}❌${NC} package.json NOT found"
fi

echo ""
echo "🔍 Checking main.tsx content..."
echo "-----------------------------------------"
if [ -f "src/main.tsx" ]; then
    if grep -q "App from './app/App'" src/main.tsx; then
        echo -e "${GREEN}✅${NC} main.tsx imports App correctly"
    else
        echo -e "${YELLOW}⚠️${NC} main.tsx may have test content"
    fi
else
    echo -e "${RED}❌${NC} main.tsx NOT found"
fi

echo ""
echo "🔍 Checking if node_modules exists..."
echo "-----------------------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules exists"
else
    echo -e "${RED}❌${NC} node_modules NOT found (run npm install)"
fi

echo ""
echo "========================================="
echo "📊 SUMMARY"
echo "========================================="
echo ""
echo "If you see ❌ on any file, that file is missing."
echo "If you see ⚠️ on main.tsx, it needs to be fixed."
echo ""
echo "To fix missing files, run the appropriate commands."
echo ""
