#!/bin/bash
# Load Sample Kong Configuration
# Loads test-data/sample-kong-config.yaml into Kong using decK

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"
SAMPLE_FILE="test-data/sample-kong-config.yaml"

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Load Sample Kong Configuration${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_deck() {
    if ! command -v deck &> /dev/null; then
        print_error "decK is not installed"
        echo ""
        echo "Install decK:"
        echo "  macOS:   brew install deck"
        echo "  Linux:   curl -sL https://github.com/kong/deck/releases/latest/download/deck_linux_amd64.tar.gz -o deck.tar.gz && tar -xzf deck.tar.gz && sudo mv deck /usr/local/bin/"
        echo "  Docker:  Use docker run kong/deck"
        echo ""
        exit 1
    fi
    print_success "decK found: $(deck version)"
}

check_kong() {
    print_info "Checking Kong connection at $KONG_ADMIN_URL..."

    if ! curl -sf "$KONG_ADMIN_URL" > /dev/null 2>&1; then
        print_error "Cannot connect to Kong Admin API at $KONG_ADMIN_URL"
        echo ""
        echo "Make sure Kong is running:"
        echo "  docker-compose up -d"
        echo ""
        exit 1
    fi

    print_success "Connected to Kong Admin API"
}

check_sample_file() {
    if [ ! -f "$SAMPLE_FILE" ]; then
        print_error "Sample file not found: $SAMPLE_FILE"
        exit 1
    fi
    print_success "Sample file found: $SAMPLE_FILE"
}

load_data() {
    print_info "Loading sample data into Kong..."
    echo ""

    # Show what will be loaded
    print_info "Preview of configuration:"
    deck dump --kong-addr "$KONG_ADMIN_URL" -o /dev/null 2>&1 || true

    # Validate the file first
    print_info "Validating configuration file..."
    if deck validate -s "$SAMPLE_FILE" --kong-addr "$KONG_ADMIN_URL"; then
        print_success "Configuration is valid"
    else
        print_error "Configuration validation failed"
        exit 1
    fi

    # Show diff
    echo ""
    print_info "Changes that will be applied:"
    deck diff -s "$SAMPLE_FILE" --kong-addr "$KONG_ADMIN_URL" || true

    # Ask for confirmation
    echo ""
    read -p "Continue with loading? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cancelled"
        exit 0
    fi

    # Sync the configuration
    echo ""
    print_info "Syncing configuration to Kong..."
    if deck sync -s "$SAMPLE_FILE" --kong-addr "$KONG_ADMIN_URL"; then
        print_success "Sample data loaded successfully!"
    else
        print_error "Failed to load sample data"
        exit 1
    fi
}

show_summary() {
    echo ""
    print_info "Current Kong configuration:"
    ./scripts/discover-kong.sh --url "$KONG_ADMIN_URL"
}

# Main
print_header
check_deck
check_kong
check_sample_file
echo ""
load_data
show_summary

echo ""
print_success "All done! You can now:"
echo "  1. Test the configuration: curl http://localhost:8000/httpbin/get"
echo "  2. View in Kong Manager: http://localhost:8002"
echo "  3. Open Kong Suite Flow Builder: http://localhost:5173/flow-builder"
