import { Router } from 'express';
import { flowRoutes } from './flow-routes';
import { migrationRoutes } from './migration-routes';
import { visualizationRoutes } from './visualization-routes';
import { dataRoutes } from './data-routes';

export const routes = Router();

// Mount route modules
routes.use('/flows', flowRoutes);
routes.use('/migration', migrationRoutes);
routes.use('/visualize', visualizationRoutes);
routes.use('/data', dataRoutes);
