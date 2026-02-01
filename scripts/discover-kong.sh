#!/bin/bash
# Kong Discovery Script
# Discovers Kong configuration and provides options to export or visualize

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"
OUTPUT_FORMAT="${OUTPUT_FORMAT:-summary}"
OUTPUT_FILE=""

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Kong Configuration Discovery${NC}"
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

check_dependencies() {
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        print_info "jq is not installed. Some features will be limited."
        print_info "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
    fi
}

test_connection() {
    print_info "Testing connection to Kong Admin API at $KONG_ADMIN_URL..."

    if ! response=$(curl -sf "$KONG_ADMIN_URL" 2>&1); then
        print_error "Failed to connect to Kong Admin API"
        echo "URL: $KONG_ADMIN_URL"
        echo "Error: $response"
        exit 1
    fi

    print_success "Connected to Kong Admin API"

    if command -v jq &> /dev/null; then
        version=$(echo "$response" | jq -r '.version' 2>/dev/null || echo "unknown")
        hostname=$(echo "$response" | jq -r '.hostname' 2>/dev/null || echo "unknown")
        print_info "Kong version: $version"
        print_info "Hostname: $hostname"
    fi
    echo ""
}

get_entity_count() {
    local endpoint=$1
    local count=$(curl -sf "$KONG_ADMIN_URL/$endpoint" | jq -r '.data | length' 2>/dev/null || echo "0")
    echo "$count"
}

show_summary() {
    print_info "Fetching Kong configuration summary..."
    echo ""

    services=$(get_entity_count "services")
    routes=$(get_entity_count "routes")
    plugins=$(get_entity_count "plugins")
    consumers=$(get_entity_count "consumers")
    upstreams=$(get_entity_count "upstreams")
    certificates=$(get_entity_count "certificates")

    echo "Configuration Summary:"
    echo "  Services:     $services"
    echo "  Routes:       $routes"
    echo "  Plugins:      $plugins"
    echo "  Consumers:    $consumers"
    echo "  Upstreams:    $upstreams"
    echo "  Certificates: $certificates"
    echo ""

    if [ "$services" -eq 0 ] && [ "$routes" -eq 0 ]; then
        print_info "No services or routes found. Kong is empty."
        echo ""
        print_info "To load sample data, run:"
        echo "  deck sync -s test-data/sample-kong-config.yaml"
        echo ""
    fi
}

export_json() {
    local output_file=$1
    print_info "Exporting Kong configuration to JSON..."

    services=$(curl -sf "$KONG_ADMIN_URL/services")
    routes=$(curl -sf "$KONG_ADMIN_URL/routes")
    plugins=$(curl -sf "$KONG_ADMIN_URL/plugins")
    consumers=$(curl -sf "$KONG_ADMIN_URL/consumers")
    upstreams=$(curl -sf "$KONG_ADMIN_URL/upstreams")

    if command -v jq &> /dev/null; then
        jq -n \
            --argjson services "$services" \
            --argjson routes "$routes" \
            --argjson plugins "$plugins" \
            --argjson consumers "$consumers" \
            --argjson upstreams "$upstreams" \
            '{
                services: $services.data,
                routes: $routes.data,
                plugins: $plugins.data,
                consumers: $consumers.data,
                upstreams: $upstreams.data
            }' > "$output_file"

        print_success "Configuration exported to $output_file"
    else
        print_error "jq is required for JSON export"
        exit 1
    fi
}

show_services_detail() {
    print_info "Services in Kong:"
    echo ""

    if command -v jq &> /dev/null; then
        services=$(curl -sf "$KONG_ADMIN_URL/services")
        echo "$services" | jq -r '.data[] | "  • \(.name) - \(.protocol)://\(.host):\(.port)\(.path // "")"'
    else
        curl -sf "$KONG_ADMIN_URL/services" | grep -o '"name":"[^"]*"' | sed 's/"name":"\([^"]*\)"/  • \1/'
    fi
    echo ""
}

show_routes_detail() {
    print_info "Routes in Kong:"
    echo ""

    if command -v jq &> /dev/null; then
        routes=$(curl -sf "$KONG_ADMIN_URL/routes")
        echo "$routes" | jq -r '.data[] | "  • \(.name // "unnamed") - \(.paths // [] | join(", "))"'
    else
        curl -sf "$KONG_ADMIN_URL/routes" | grep -o '"name":"[^"]*"' | sed 's/"name":"\([^"]*\)"/  • \1/'
    fi
    echo ""
}

show_plugins_detail() {
    print_info "Plugins in Kong:"
    echo ""

    if command -v jq &> /dev/null; then
        plugins=$(curl -sf "$KONG_ADMIN_URL/plugins")
        echo "$plugins" | jq -r '.data[] | "  • \(.name) (\(if .enabled then "enabled" else "disabled" end))"'
    else
        curl -sf "$KONG_ADMIN_URL/plugins" | grep -o '"name":"[^"]*"' | sed 's/"name":"\([^"]*\)"/  • \1/'
    fi
    echo ""
}

show_help() {
    cat << EOF
Kong Configuration Discovery Script

Usage: $0 [OPTIONS]

Options:
    -u, --url URL          Kong Admin API URL (default: http://localhost:8001)
    -f, --format FORMAT    Output format: summary|detail|json (default: summary)
    -o, --output FILE      Output file for JSON export
    -h, --help             Show this help message

Examples:
    # Show summary of Kong configuration
    $0

    # Show detailed configuration
    $0 --format detail

    # Export to JSON file
    $0 --format json --output kong-config.json

    # Use custom Kong Admin URL
    $0 --url http://kong.example.com:8001

Environment Variables:
    KONG_ADMIN_URL         Kong Admin API URL
    KONG_ADMIN_TOKEN       Kong Admin API token (for authenticated access)

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            KONG_ADMIN_URL="$2"
            shift 2
            ;;
        -f|--format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
print_header
check_dependencies
test_connection

case $OUTPUT_FORMAT in
    summary)
        show_summary
        ;;
    detail)
        show_summary
        show_services_detail
        show_routes_detail
        show_plugins_detail
        ;;
    json)
        if [ -z "$OUTPUT_FILE" ]; then
            OUTPUT_FILE="kong-config-$(date +%Y%m%d-%H%M%S).json"
        fi
        export_json "$OUTPUT_FILE"
        ;;
    *)
        print_error "Unknown format: $OUTPUT_FORMAT"
        show_help
        exit 1
        ;;
esac

print_success "Discovery complete!"
