<<<<<<< HEAD
# kong-suite
A visual kong flow builder, migration assistant, configuration visualizer and data manager. 
=======
# Kong Suite

> A visual flow builder for Kong API Gateway - Design, understand, and deploy Kong configurations with drag-and-drop simplicity.

**Status**: 🚧 MVP in Development (Phase 1 ✅ Complete, Week 2 in Progress)

![Kong Suite](https://img.shields.io/badge/Kong-3.5-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Security](https://img.shields.io/badge/Security-Audited-green)

---

## ✨ What is Kong Suite?

Kong Suite is a **visual development tool** that makes Kong API Gateway configuration easy and intuitive:

- 🎨 **Drag-and-drop interface** to design Kong configurations
- 🔍 **Visual validation** prevents configuration errors
- 📝 **Generate decK YAML** for GitOps workflows
- 🚀 **One-click deployment** to Kong instances

### Why Kong Suite?

**Before**: Writing YAML configs manually, struggling with entity relationships, breaking production
**After**: Visual design, real-time validation, confidence in deployments

---

## 🎯 MVP Focus

**Building ONE feature really well**: The Flow Builder

- ✅ **Visual Canvas** with drag-and-drop nodes
- ✅ **5 Kong Entity Types**: Service, Route, Plugin, Consumer, Upstream
- ✅ **Connection Validation** based on Kong relationships
- ⏳ **Properties Panel** to configure nodes (Week 2)
- 🔜 **decK YAML Generation** (Week 3)
- 🔜 **Deploy to Kong** (Week 3)

Other features (Migration, Visualization, Backup) provided as **scripts + documentation**.

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- (Optional) decK CLI

### 5-Minute Setup

```bash
# 1. Start Kong
docker-compose up -d

# 2. Install dependencies
cd shared && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Load sample data
./scripts/load-sample-data.sh

# 4. Start Kong Suite
npm run dev

# 5. Open Flow Builder
open http://localhost:5173/flow-builder
```

**First time?** Read [READY-TO-TEST.md](READY-TO-TEST.md) for detailed instructions.

---

## 🎨 Current Features (Phase 1 Complete)

### Flow Builder
- ✅ Drag-and-drop node creation
- ✅ Visual connection drawing
- ✅ Connection validation (prevents invalid links)
- ✅ 5 node types with custom styling
- ✅ Minimap and canvas controls
- ✅ Node selection and deletion

### Node Types
- 🔷 **Service** (Blue) - Backend services
- 🔶 **Route** (Orange) - Request routing rules
- 🔌 **Plugin** (Purple) - Kong plugins (rate-limiting, auth, CORS, etc.)
- 👤 **Consumer** (Green) - API consumers
- 🔀 **Upstream** (Teal) - Load balancer configurations

### Testing & Scripts
- ✅ Kong discovery script (analyze existing configs)
- ✅ Sample data loader (realistic test scenarios)
- ✅ Docker Compose setup with Kong 3.5
- ✅ Comprehensive testing guide

---

## 📁 Project Structure

```
kong-suite/
├── frontend/          # React + Vite + React Flow
│   └── src/
│       ├── components/FlowBuilder/  # Flow canvas & nodes
│       ├── stores/                  # Zustand state
│       └── utils/                   # Validators, defaults
├── backend/           # Express + TypeScript
│   └── src/
│       ├── routes/                  # API endpoints
│       └── services/kong-client/    # Kong Admin API
├── shared/            # Shared TypeScript types
├── test-data/         # Sample Kong configurations
├── scripts/           # Utility scripts
└── docs/              # Documentation
```

---

## 🧪 Testing

### Quick Test
```bash
# Start Kong and load sample data
docker-compose up -d
./scripts/load-sample-data.sh

# Start Kong Suite
npm run dev

# Test in browser
open http://localhost:5173/flow-builder
```

### Comprehensive Testing
See [TESTING-GUIDE.md](TESTING-GUIDE.md) for:
- End-to-end testing procedures
- Sample scenarios to test
- Troubleshooting guide
- Verification checklist

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [READY-TO-TEST.md](READY-TO-TEST.md) | Quick start & testing guide |
| [TESTING-GUIDE.md](TESTING-GUIDE.md) | Comprehensive testing procedures |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [MVP-PROGRESS.md](MVP-PROGRESS.md) | Development progress tracker |
| [SECURITY-AUDIT.md](SECURITY-AUDIT.md) | Security review (PASS ✅) |
| [SESSION-SUMMARY.md](SESSION-SUMMARY.md) | Latest development session notes |
| [scripts/README.md](scripts/README.md) | Script documentation |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Flow** - Node-based editor
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Winston** - Logging
- **Zod** - Validation

### DevOps
- **Docker Compose** - Local development
- **Kong Gateway 3.5** - API Gateway
- **PostgreSQL 15** - Database
- **decK** - Declarative configuration

---

## 🔒 Security

✅ **Security Audit Passed** - No critical vulnerabilities

- Input validation with TypeScript + Zod
- XSS protection via React
- CORS properly configured
- Secrets via environment variables
- Docker security best practices

See [SECURITY-AUDIT.md](SECURITY-AUDIT.md) for full report.

---

## 📋 Roadmap

### ✅ Phase 1: Foundation (Complete)
- Monorepo setup
- Kong Admin API client
- Docker environment

### ✅ Phase 2 Week 1: Flow Canvas (Complete)
- Visual canvas with React Flow
- 5 custom node types
- Connection validation

### ⏳ Phase 2 Week 2: Properties & Validation (In Progress)
- Properties panel
- Node configuration forms
- Flow storage (save/load)

### 🔜 Phase 2 Week 3: decK Integration
- Generate decK YAML from flows
- Deploy to Kong
- Diff preview

### 🔜 Phase 2 Week 4: Polish
- Example flow gallery
- Documentation
- Testing
- Demo video

---

## 🤝 Contributing

Kong Suite is in active MVP development. Contributions welcome after MVP completion.

**Current focus**: Building core Flow Builder functionality

---

## 📝 Scripts

### Kong Discovery
```bash
# Analyze Kong configuration
./scripts/discover-kong.sh

# Detailed view
./scripts/discover-kong.sh --format detail

# Export to JSON
./scripts/discover-kong.sh --format json --output config.json
```

### Load Sample Data
```bash
# Load realistic test configuration
./scripts/load-sample-data.sh
```

See [scripts/README.md](scripts/README.md) for all available scripts.

---

## 🐛 Troubleshooting

**Kong won't start:**
```bash
docker-compose down -v
docker-compose up -d
```

**Dependencies issues:**
```bash
npm run clean
npm install  # in root, shared, backend, frontend
```

**See full troubleshooting**: [TESTING-GUIDE.md](TESTING-GUIDE.md#troubleshooting)

---

## 🎯 Next Session

**Goal**: Build Properties Panel

Tasks:
- Properties panel (right sidebar)
- Dynamic forms for each node type
- Save/load flows
- Form validation

**ETA**: 4-6 hours

---

## 📞 Support

- **Issues**: Report in GitHub Issues
- **Questions**: Check [TESTING-GUIDE.md](TESTING-GUIDE.md)
- **Security**: See [SECURITY-AUDIT.md](SECURITY-AUDIT.md)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Kong for the amazing API Gateway
- React Flow for the excellent node editor
- The open-source community

---

**Kong Suite** - Making Kong Configuration Visual and Simple 🚀

*Built with ❤️ for the Kong community*
>>>>>>> 54c7977 (initial flow functionality)
