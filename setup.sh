#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 HTTP Server Setup Script${NC}"
echo -e "${BLUE}===========================${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Step 2: Make scripts executable
echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
chmod +x your_server.sh test.sh 2>/dev/null || echo "Note: chmod may not work on Windows - use 'bash script.sh' instead"
echo -e "${GREEN}✓ Scripts are now executable${NC}"

# Step 3: Create tmp directory if it doesn't exist
echo -e "${YELLOW}📁 Setting up directories...${NC}"
mkdir -p tmp
echo "HTTP Server setup complete!" > tmp/readme.txt
echo -e "${GREEN}✓ Test directory created${NC}"

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Quick start commands:${NC}"
echo -e "  Start server: ${YELLOW}./your_server.sh${NC} or ${YELLOW}bash your_server.sh${NC}"
echo -e "  Run tests:    ${YELLOW}./test.sh${NC} or ${YELLOW}bash test.sh${NC}"
echo -e "  Test manually: ${YELLOW}curl http://localhost:4221${NC}"
echo ""