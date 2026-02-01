# Kong Suite Scripts

Utility scripts for managing and testing Kong configurations.

## Available Scripts

### 1. `discover-kong.sh`
**Purpose**: Discover and analyze Kong configuration

**Usage:**
```bash
# Basic summary
./scripts/discover-kong.sh

# Detailed view with all entities
./scripts/discover-kong.sh --format detail

# Export to JSON
./scripts/discover-kong.sh --format json --output my-config.json

# Custom Kong URL
./scripts/discover-kong.sh --url http://kong.example.com:8001
```

**Options:**
- `-u, --url URL` - Kong Admin API URL (default: http://localhost:8001)
- `-f, --format FORMAT` - Output format: summary|detail|json (default: summary)
- `-o, --output FILE` - Output file for JSON export
- `-h, --help` - Show help message

**Requirements:**
- `curl` (required)
- `jq` (optional, for better formatting)

**Example Output:**
```
================================
  Kong Configuration Discovery
================================

✓ Connected to Kong Admin API
ℹ Kong version: 3.5.0
ℹ Hostname: kong

Configuration Summary:
  Services:     4
  Routes:       4
  Plugins:      5
  Consumers:    3
  Upstreams:    1
  Certificates: 0
```

---

### 2. `load-sample-data.sh`
**Purpose**: Load test data into Kong for testing Kong Suite

**Usage:**
```bash
# Interactive mode (asks for confirmation)
./scripts/load-sample-data.sh

# Set custom Kong URL
KONG_ADMIN_URL=http://kong:8001 ./scripts/load-sample-data.sh
```

**What it does:**
1. Checks if decK is installed
2. Validates Kong connection
3. Shows preview of changes
4. Asks for confirmation
5. Loads `test-data/sample-kong-config.yaml` into Kong
6. Shows summary of loaded configuration

**Requirements:**
- `decK` CLI tool ([install instructions](https://docs.konghq.com/deck/))
- Kong Admin API accessible
- `test-data/sample-kong-config.yaml` file

**Sample Data Includes:**
- 4 Services (httpbin, auth-api, rate-limited-api, microservice)
- 4 Routes (various paths and methods)
- 5 Plugins (CORS, rate-limiting, key-auth, transformers)
- 3 Consumers with API keys
- 1 Upstream with 3 targets (load balancing)

---

### 3. `migrate.sh` (Coming Soon)
**Purpose**: Migrate Kong configuration between environments using decK

**Planned Features:**
- Export from source Kong
- Preview changes on target
- Apply to target Kong
- Support for different Kong versions
- Workspace support

---

### 4. `backup.sh` (Coming Soon)
**Purpose**: Backup Kong database

**Planned Features:**
- PostgreSQL dump
- Automated scheduling
- Restore functionality
- Backup rotation

---

## Installation

### Install decK

**macOS:**
```bash
brew install deck
```

**Linux:**
```bash
curl -sL https://github.com/kong/deck/releases/latest/download/deck_linux_amd64.tar.gz -o deck.tar.gz
tar -xzf deck.tar.gz
sudo mv deck /usr/local/bin/
chmod +x /usr/local/bin/deck
```

**Docker:**
```bash
docker run kong/deck version
```

**Verify:**
```bash
deck version
```

### Install jq (Optional, for better formatting)

**macOS:**
```bash
brew install jq
```

**Linux:**
```bash
apt-get install jq  # Debian/Ubuntu
yum install jq      # RHEL/CentOS
```

## Common Workflows

### Workflow 1: Test with Sample Data

```bash
# 1. Start Kong
docker-compose up -d

# 2. Load sample data
./scripts/load-sample-data.sh

# 3. Verify data loaded
./scripts/discover-kong.sh --format detail

# 4. Test API endpoints
curl http://localhost:8000/httpbin/get
```

### Workflow 2: Discover Existing Kong

```bash
# 1. Connect to your Kong instance
./scripts/discover-kong.sh --url https://your-kong:8001

# 2. Export configuration
./scripts/discover-kong.sh \
  --url https://your-kong:8001 \
  --format json \
  --output prod-kong-config.json

# 3. View the export
cat prod-kong-config.json | jq .
```

### Workflow 3: Compare Configurations

```bash
# 1. Export source Kong
./scripts/discover-kong.sh \
  --url http://source-kong:8001 \
  --format json \
  --output source.json

# 2. Export target Kong
./scripts/discover-kong.sh \
  --url http://target-kong:8001 \
  --format json \
  --output target.json

# 3. Compare with jq
diff <(jq -S . source.json) <(jq -S . target.json)
```

### Workflow 4: Reset Kong to Clean State

```bash
# 1. Remove all configuration
deck reset --kong-addr http://localhost:8001

# 2. Verify clean
./scripts/discover-kong.sh
# Should show 0 services, routes, etc.

# 3. Reload sample data if needed
./scripts/load-sample-data.sh
```

## Environment Variables

All scripts support these environment variables:

```bash
# Kong connection
export KONG_ADMIN_URL=http://localhost:8001
export KONG_ADMIN_TOKEN=your-admin-token  # If Kong has auth enabled

# Run script
./scripts/discover-kong.sh
```

## Troubleshooting

### "Cannot connect to Kong"

```bash
# Check if Kong is running
curl http://localhost:8001

# Check Docker containers
docker-compose ps

# Restart Kong
docker-compose restart kong
```

### "decK not found"

```bash
# Check if decK is installed
which deck

# If not installed, see Installation section above
```

### "jq not found"

```bash
# Scripts work without jq, but output is less formatted
# To install jq, see Installation section above
```

### "Permission denied"

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Or run with bash
bash scripts/discover-kong.sh
```

## Contributing

When adding new scripts:

1. Follow the same structure (print_header, print_success, print_error)
2. Use colors for better UX
3. Add `--help` option
4. Support environment variables
5. Handle errors gracefully
6. Document in this README

## Script Template

```bash
#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Your script logic here
```

## References

- [decK Documentation](https://docs.konghq.com/deck/)
- [Kong Admin API](https://docs.konghq.com/gateway/latest/admin-api/)
- [Kong Configuration](https://docs.konghq.com/gateway/latest/reference/configuration/)
