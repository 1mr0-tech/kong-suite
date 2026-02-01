import ServiceNode from './ServiceNode';
import RouteNode from './RouteNode';
import PluginNode from './PluginNode';
import ConsumerNode from './ConsumerNode';
import UpstreamNode from './UpstreamNode';

export const nodeTypes = {
  service: ServiceNode,
  route: RouteNode,
  plugin: PluginNode,
  consumer: ConsumerNode,
  upstream: UpstreamNode,
};

export { ServiceNode, RouteNode, PluginNode, ConsumerNode, UpstreamNode };
