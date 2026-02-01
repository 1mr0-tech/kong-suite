import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  KongService,
  KongRoute,
  KongPlugin,
  KongConsumer,
  KongUpstream,
  KongTarget,
  KongCertificate,
  KongSNI,
  KongListResponse,
  KongInfo,
  KongStatus,
} from '@kong-suite/shared';
import { logger } from '../../utils/logger';

export interface AdminApiConfig {
  url: string;
  adminToken?: string;
  workspace?: string;
}

export class KongAdminApiClient {
  private client: AxiosInstance;
  private workspace?: string;

  constructor(config: AdminApiConfig) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.adminToken) {
      headers['Kong-Admin-Token'] = config.adminToken;
    }

    this.client = axios.create({
      baseURL: config.url,
      headers,
      timeout: 10000,
    });

    this.workspace = config.workspace;

    // Add request/response logging
    this.client.interceptors.request.use((config) => {
      logger.debug(`Kong API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        logger.error('Kong API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  private getPath(path: string): string {
    if (this.workspace) {
      return `/${this.workspace}${path}`;
    }
    return path;
  }

  // ============= Info & Status =============

  async getInfo(): Promise<KongInfo> {
    const response = await this.client.get<KongInfo>('/');
    return response.data;
  }

  async getStatus(): Promise<KongStatus> {
    const response = await this.client.get<KongStatus>('/status');
    return response.data;
  }

  async testConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
    try {
      const info = await this.getInfo();
      return {
        success: true,
        version: info.version,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ============= Services =============

  async listServices(): Promise<KongService[]> {
    const response = await this.client.get<KongListResponse<KongService>>(
      this.getPath('/services')
    );
    return response.data.data;
  }

  async getService(idOrName: string): Promise<KongService> {
    const response = await this.client.get<KongService>(
      this.getPath(`/services/${idOrName}`)
    );
    return response.data;
  }

  async createService(service: Omit<KongService, 'id' | 'created_at' | 'updated_at'>): Promise<KongService> {
    const response = await this.client.post<KongService>(
      this.getPath('/services'),
      service
    );
    return response.data;
  }

  async updateService(idOrName: string, service: Partial<KongService>): Promise<KongService> {
    const response = await this.client.patch<KongService>(
      this.getPath(`/services/${idOrName}`),
      service
    );
    return response.data;
  }

  async deleteService(idOrName: string): Promise<void> {
    await this.client.delete(this.getPath(`/services/${idOrName}`));
  }

  // ============= Routes =============

  async listRoutes(): Promise<KongRoute[]> {
    const response = await this.client.get<KongListResponse<KongRoute>>(
      this.getPath('/routes')
    );
    return response.data.data;
  }

  async getRoute(id: string): Promise<KongRoute> {
    const response = await this.client.get<KongRoute>(
      this.getPath(`/routes/${id}`)
    );
    return response.data;
  }

  async createRoute(route: Omit<KongRoute, 'id' | 'created_at' | 'updated_at'>): Promise<KongRoute> {
    const response = await this.client.post<KongRoute>(
      this.getPath('/routes'),
      route
    );
    return response.data;
  }

  async updateRoute(id: string, route: Partial<KongRoute>): Promise<KongRoute> {
    const response = await this.client.patch<KongRoute>(
      this.getPath(`/routes/${id}`),
      route
    );
    return response.data;
  }

  async deleteRoute(id: string): Promise<void> {
    await this.client.delete(this.getPath(`/routes/${id}`));
  }

  // ============= Plugins =============

  async listPlugins(): Promise<KongPlugin[]> {
    const response = await this.client.get<KongListResponse<KongPlugin>>(
      this.getPath('/plugins')
    );
    return response.data.data;
  }

  async getPlugin(id: string): Promise<KongPlugin> {
    const response = await this.client.get<KongPlugin>(
      this.getPath(`/plugins/${id}`)
    );
    return response.data;
  }

  async createPlugin(plugin: Omit<KongPlugin, 'id' | 'created_at' | 'updated_at'>): Promise<KongPlugin> {
    const response = await this.client.post<KongPlugin>(
      this.getPath('/plugins'),
      plugin
    );
    return response.data;
  }

  async updatePlugin(id: string, plugin: Partial<KongPlugin>): Promise<KongPlugin> {
    const response = await this.client.patch<KongPlugin>(
      this.getPath(`/plugins/${id}`),
      plugin
    );
    return response.data;
  }

  async deletePlugin(id: string): Promise<void> {
    await this.client.delete(this.getPath(`/plugins/${id}`));
  }

  // ============= Consumers =============

  async listConsumers(): Promise<KongConsumer[]> {
    const response = await this.client.get<KongListResponse<KongConsumer>>(
      this.getPath('/consumers')
    );
    return response.data.data;
  }

  async getConsumer(idOrUsername: string): Promise<KongConsumer> {
    const response = await this.client.get<KongConsumer>(
      this.getPath(`/consumers/${idOrUsername}`)
    );
    return response.data;
  }

  async createConsumer(consumer: Omit<KongConsumer, 'id' | 'created_at' | 'updated_at'>): Promise<KongConsumer> {
    const response = await this.client.post<KongConsumer>(
      this.getPath('/consumers'),
      consumer
    );
    return response.data;
  }

  async updateConsumer(idOrUsername: string, consumer: Partial<KongConsumer>): Promise<KongConsumer> {
    const response = await this.client.patch<KongConsumer>(
      this.getPath(`/consumers/${idOrUsername}`),
      consumer
    );
    return response.data;
  }

  async deleteConsumer(idOrUsername: string): Promise<void> {
    await this.client.delete(this.getPath(`/consumers/${idOrUsername}`));
  }

  // ============= Upstreams =============

  async listUpstreams(): Promise<KongUpstream[]> {
    const response = await this.client.get<KongListResponse<KongUpstream>>(
      this.getPath('/upstreams')
    );
    return response.data.data;
  }

  async getUpstream(idOrName: string): Promise<KongUpstream> {
    const response = await this.client.get<KongUpstream>(
      this.getPath(`/upstreams/${idOrName}`)
    );
    return response.data;
  }

  async createUpstream(upstream: Omit<KongUpstream, 'id' | 'created_at' | 'updated_at'>): Promise<KongUpstream> {
    const response = await this.client.post<KongUpstream>(
      this.getPath('/upstreams'),
      upstream
    );
    return response.data;
  }

  async updateUpstream(idOrName: string, upstream: Partial<KongUpstream>): Promise<KongUpstream> {
    const response = await this.client.patch<KongUpstream>(
      this.getPath(`/upstreams/${idOrName}`),
      upstream
    );
    return response.data;
  }

  async deleteUpstream(idOrName: string): Promise<void> {
    await this.client.delete(this.getPath(`/upstreams/${idOrName}`));
  }

  // ============= Targets =============

  async listTargets(upstreamIdOrName: string): Promise<KongTarget[]> {
    const response = await this.client.get<KongListResponse<KongTarget>>(
      this.getPath(`/upstreams/${upstreamIdOrName}/targets`)
    );
    return response.data.data;
  }

  async createTarget(upstreamIdOrName: string, target: Omit<KongTarget, 'id' | 'upstream' | 'created_at' | 'updated_at'>): Promise<KongTarget> {
    const response = await this.client.post<KongTarget>(
      this.getPath(`/upstreams/${upstreamIdOrName}/targets`),
      target
    );
    return response.data;
  }

  async deleteTarget(upstreamIdOrName: string, targetIdOrHost: string): Promise<void> {
    await this.client.delete(
      this.getPath(`/upstreams/${upstreamIdOrName}/targets/${targetIdOrHost}`)
    );
  }

  // ============= Certificates =============

  async listCertificates(): Promise<KongCertificate[]> {
    const response = await this.client.get<KongListResponse<KongCertificate>>(
      this.getPath('/certificates')
    );
    return response.data.data;
  }

  async getCertificate(id: string): Promise<KongCertificate> {
    const response = await this.client.get<KongCertificate>(
      this.getPath(`/certificates/${id}`)
    );
    return response.data;
  }

  async createCertificate(certificate: Omit<KongCertificate, 'id' | 'created_at' | 'updated_at'>): Promise<KongCertificate> {
    const response = await this.client.post<KongCertificate>(
      this.getPath('/certificates'),
      certificate
    );
    return response.data;
  }

  async updateCertificate(id: string, certificate: Partial<KongCertificate>): Promise<KongCertificate> {
    const response = await this.client.patch<KongCertificate>(
      this.getPath(`/certificates/${id}`),
      certificate
    );
    return response.data;
  }

  async deleteCertificate(id: string): Promise<void> {
    await this.client.delete(this.getPath(`/certificates/${id}`));
  }

  // ============= SNIs =============

  async listSNIs(): Promise<KongSNI[]> {
    const response = await this.client.get<KongListResponse<KongSNI>>(
      this.getPath('/snis')
    );
    return response.data.data;
  }

  async getSNI(nameOrId: string): Promise<KongSNI> {
    const response = await this.client.get<KongSNI>(
      this.getPath(`/snis/${nameOrId}`)
    );
    return response.data;
  }

  async createSNI(sni: Omit<KongSNI, 'id' | 'created_at' | 'updated_at'>): Promise<KongSNI> {
    const response = await this.client.post<KongSNI>(
      this.getPath('/snis'),
      sni
    );
    return response.data;
  }

  async updateSNI(nameOrId: string, sni: Partial<KongSNI>): Promise<KongSNI> {
    const response = await this.client.patch<KongSNI>(
      this.getPath(`/snis/${nameOrId}`),
      sni
    );
    return response.data;
  }

  async deleteSNI(nameOrId: string): Promise<void> {
    await this.client.delete(this.getPath(`/snis/${nameOrId}`));
  }

  // ============= Bulk Operations =============

  async getAllEntities() {
    const [services, routes, plugins, consumers, upstreams, certificates, snis] = await Promise.all([
      this.listServices(),
      this.listRoutes(),
      this.listPlugins(),
      this.listConsumers(),
      this.listUpstreams(),
      this.listCertificates(),
      this.listSNIs(),
    ]);

    return {
      services,
      routes,
      plugins,
      consumers,
      upstreams,
      certificates,
      snis,
    };
  }
}
