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

  const onEdgeClick = useCallback(
    (evt: React.MouseEvent) => {
      evt.stopPropagation();
      // Use double-click pattern to avoid instant dismissal issues
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    },
    [id, setEdges]
  );

  return (
    <>
      <path
        id={id}
        style={{
          stroke: '#b1b1b7',
          strokeWidth: 2,
          ...style,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={24}
        height={24}
        x={labelX - 12}
        y={labelY - 12}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ pointerEvents: 'all', overflow: 'visible' }}
      >
        <button
          className="edgebutton bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors cursor-pointer border-2 border-white flex items-center justify-center"
          onClick={onEdgeClick}
          onMouseDown={(e) => e.stopPropagation()}
          title="Click to delete connection"
          style={{ width: '24px', height: '24px', pointerEvents: 'all' }}
        >
          <X size={14} />
        </button>
      </foreignObject>
    </>
  );
}
