import { useCallback } from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow';
import { X } from 'lucide-react';

export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Debug logging
  if (import.meta.env.DEV) {
    console.log('Edge render:', {
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      edgePath: edgePath.substring(0, 50),
      style,
    });
  }

  const onEdgeClick = useCallback(
    (evt: React.MouseEvent) => {
      evt.stopPropagation();
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    },
    [id, setEdges]
  );

  return (
    <g className="react-flow__edge">
      <path
        id={id}
        style={{
          stroke: '#3b82f6',
          strokeWidth: 3,
          fill: 'none',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      <foreignObject
        width={24}
        height={24}
        x={labelX - 12}
        y={labelY - 12}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button
          className="edgebutton bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors cursor-pointer border-2 border-white flex items-center justify-center"
          onClick={onEdgeClick}
          onMouseDown={(e) => e.stopPropagation()}
          title="Click to delete connection"
          style={{ width: '24px', height: '24px' }}
        >
          <X size={14} />
        </button>
      </foreignObject>
    </g>
  );
}
