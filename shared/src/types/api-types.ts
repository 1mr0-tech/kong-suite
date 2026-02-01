/**
 * API Types
 * Types for API requests and responses
 */

import type { Flow, FlowValidationResult, GeneratedOutput, FlowExplanation } from './flow-types';
import type { KongService, KongRoute, KongPlugin, KongConsumer, KongUpstream } from './kong-entities';

// Common
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Kong Connection
export interface KongConnectionConfig {
  url: string;
  adminToken?: string;
  workspace?: string;
}

export interface KongConnectionTestResult {
  success: boolean;
  version?: string;
  database?: string;
  error?: string;
}

// Flow Builder API
export interface ValidateFlowRequest {
  flow: Flow;
}

export interface ValidateFlowResponse {
  validation: FlowValidationResult;
}

export interface GenerateFlowRequest {
  flow: Flow;
  format: 'admin-api' | 'deck-yaml' | 'deck-json';
}

export interface GenerateFlowResponse {
  output: GeneratedOutput;
}

export interface ExplainFlowRequest {
  flow: Flow;
}

export interface ExplainFlowResponse {
  explanation: FlowExplanation;
}

export interface SaveFlowRequest {
  flow: Flow;
}

export interface SaveFlowResponse {
  flowId: string;
}

// Migration API
export interface MigrationSourceConfig extends KongConnectionConfig {
  name?: string;
}

export interface MigrationTargetConfig extends KongConnectionConfig {
  name?: string;
}

export interface MigrationEntitySelection {
  services?: string[];
  routes?: string[];
  plugins?: string[];
  consumers?: string[];
  upstreams?: string[];
  certificates?: string[];
  allServices?: boolean;
  allRoutes?: boolean;
  allPlugins?: boolean;
  allConsumers?: boolean;
  allUpstreams?: boolean;
  allCertificates?: boolean;
}

export interface MigrationPreview {
  source: {
    services: KongService[];
    routes: KongRoute[];
    plugins: KongPlugin[];
    consumers: KongConsumer[];
    upstreams: KongUpstream[];
  };
  target: {
    conflicts: MigrationConflict[];
    warnings: string[];
  };
  transformations: MigrationTransformation[];
}

export interface MigrationConflict {
  type: 'service' | 'route' | 'plugin' | 'consumer' | 'upstream';
  entityId: string;
  name: string;
  reason: string;
  resolution: 'skip' | 'overwrite' | 'rename';
}

export interface MigrationTransformation {
  type: string;
  description: string;
  entityId: string;
}

export interface MigrationExecuteRequest {
  sourceConfig: MigrationSourceConfig;
  targetConfig: MigrationTargetConfig;
  selection: MigrationEntitySelection;
  conflictResolution: Record<string, 'skip' | 'overwrite' | 'rename'>;
  dryRun?: boolean;
}

export interface MigrationExecuteResponse {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{
    entityType: string;
    entityId: string;
    error: string;
  }>;
}

// Visualization API
export interface VisualizationConfig extends KongConnectionConfig {}

export interface VisualizationEntities {
  services: KongService[];
  routes: KongRoute[];
  plugins: KongPlugin[];
  consumers: KongConsumer[];
  upstreams: KongUpstream[];
}

export interface VisualizationGraph {
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    data: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
  }>;
}

// Data Persistence API
export interface BackupConfig {
  sourceDatabase: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  targetLocation: {
    type: 'postgresql' | 'file';
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    path?: string;
  };
}

export interface BackupMetadata {
  id: string;
  name: string;
  created_at: string;
  size: number;
  kongVersion: string;
  tables: string[];
}

export interface BackupCreateRequest {
  config: BackupConfig;
  name: string;
}

export interface BackupCreateResponse {
  backup: BackupMetadata;
}

export interface BackupRestoreRequest {
  backupId: string;
  targetDatabase: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
}

export interface BackupRestoreResponse {
  success: boolean;
  tablesRestored: number;
}

export interface BackupSchedule {
  id: string;
  enabled: boolean;
  cron: string;
  config: BackupConfig;
  lastRun?: string;
  nextRun?: string;
}
