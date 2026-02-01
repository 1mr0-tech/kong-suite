/**
 * Shared Types Index
 * Export all shared types
 */

// Kong entity types
export type {
  KongService,
  KongRoute,
  KongPlugin,
  KongConsumer,
  KongUpstream,
  KongTarget,
  KongCertificate,
  KongSNI,
  KongCA,
  KongListResponse,
  KongErrorResponse,
  KongInfo,
  KongStatus,
  PluginCategory,
  PluginSchema,
} from './types/kong-entities';

// Flow types
export type {
  FlowNodeType,
  FlowNodeData,
  FlowNode,
  FlowEdge,
  Flow,
  FlowValidationResult,
  FlowValidationError,
  FlowValidationWarning,
  OutputFormat,
  GeneratedOutput,
  FlowExplanation,
  FlowExplanationStep,
  ConnectionRule,
} from './types/flow-types';

export { CONNECTION_RULES } from './types/flow-types';

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  KongConnectionConfig,
  KongConnectionTestResult,
  ValidateFlowRequest,
  ValidateFlowResponse,
  GenerateFlowRequest,
  GenerateFlowResponse,
  ExplainFlowRequest,
  ExplainFlowResponse,
  SaveFlowRequest,
  SaveFlowResponse,
  MigrationSourceConfig,
  MigrationTargetConfig,
  MigrationEntitySelection,
  MigrationPreview,
  MigrationConflict,
  MigrationTransformation,
  MigrationExecuteRequest,
  MigrationExecuteResponse,
  VisualizationConfig,
  VisualizationEntities,
  VisualizationGraph,
  BackupConfig,
  BackupMetadata,
  BackupCreateRequest,
  BackupCreateResponse,
  BackupRestoreRequest,
  BackupRestoreResponse,
  BackupSchedule,
} from './types/api-types';
