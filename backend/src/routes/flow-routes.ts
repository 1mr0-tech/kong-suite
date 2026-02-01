import { Router } from 'express';
import { DeckGenerator } from '../services/flow-generator/DeckGenerator';

export const flowRoutes = Router();

const deckGenerator = new DeckGenerator();

// POST /api/flows/validate - Validate flow structure
flowRoutes.post('/validate', async (req, res, next) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: nodes array is required',
      });
    }

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: edges array is required',
      });
    }

    const validation = deckGenerator.validateFlow(nodes, edges);

    res.json({
      success: true,
      data: {
        validation: {
          valid: validation.valid,
          errors: validation.errors,
          warnings: [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/flows/generate - Generate Kong config from flow
flowRoutes.post('/generate', async (req, res, next) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: nodes array is required',
      });
    }

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: edges array is required',
      });
    }

    // Validate first
    const validation = deckGenerator.validateFlow(nodes, edges);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Flow validation failed',
        errors: validation.errors,
      });
    }

    // Generate YAML
    const yaml = deckGenerator.generateYAML(nodes, edges);

    res.json({
      success: true,
      data: {
        output: {
          format: 'deck-yaml',
          content: yaml,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/flows/explain - Explain what flow does
flowRoutes.post('/explain', async (req, res, next) => {
  try {
    // TODO: Implement flow explanation
    res.json({
      success: true,
      data: { explanation: { summary: '', steps: [] } },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/flows/save - Save flow
flowRoutes.post('/save', async (req, res, next) => {
  try {
    // TODO: Implement flow persistence
    res.json({
      success: true,
      data: { flowId: 'placeholder' },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/flows/:id - Load saved flow
flowRoutes.get('/:id', async (req, res, next) => {
  try {
    // TODO: Implement flow loading
    res.json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
});
