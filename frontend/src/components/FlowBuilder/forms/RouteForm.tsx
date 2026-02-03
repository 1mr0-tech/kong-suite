import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';

const routeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  protocols: z.array(z.string()).min(1, 'At least one protocol is required'),
  methods: z.array(z.string()),
  paths: z.array(z.string()),
  hosts: z.array(z.string()),
  strip_path: z.boolean(),
  preserve_host: z.boolean(),
});

type RouteFormData = z.infer<typeof routeSchema>;

interface RouteFormProps {
  data: any;
  onSave: (data: RouteFormData) => void;
}

export function RouteForm({ data, onSave }: RouteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      ...data,
      methods: data.methods || [],
      paths: data.paths?.length > 0 ? data.paths : [''],
      hosts: data.hosts || [],
    },
  });

  // Reset form when data changes (e.g., switching nodes)
  useEffect(() => {
    reset({
      ...data,
      methods: data.methods || [],
      paths: data.paths?.length > 0 ? data.paths : [''],
      hosts: data.hosts || [],
    });
  }, [data, reset]);

  const { fields: pathFields, append: appendPath, remove: removePath } = useFieldArray({
    control: control as any,
    name: 'paths' as any,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const onSubmit = (formData: RouteFormData) => {
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" onKeyDown={handleKeyDown}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Route Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="my-route"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Protocols <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('protocols')}
              value="http"
              className="mr-2"
            />
            HTTP
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('protocols')}
              value="https"
              className="mr-2"
            />
            HTTPS
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('protocols')}
              value="grpc"
              className="mr-2"
            />
            gRPC
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('protocols')}
              value="grpcs"
              className="mr-2"
            />
            gRPCs
          </label>
        </div>
        {errors.protocols && (
          <p className="text-red-500 text-sm mt-1">{errors.protocols.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paths
        </label>
        {pathFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              type="text"
              {...register(`paths.${index}` as const)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="/api/users"
            />
            {pathFields.length > 1 && (
              <button
                type="button"
                onClick={() => removePath(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendPath('' as any)}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
        >
          <Plus size={16} />
          Add Path
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Methods (optional)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE'].map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                {...register('methods')}
                value={method}
                className="mr-2"
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <input
            type="checkbox"
            {...register('strip_path')}
            className="mr-2"
          />
          Strip Path
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Remove the matching prefix from the upstream request URL
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <input
            type="checkbox"
            {...register('preserve_host')}
            className="mr-2"
          />
          Preserve Host
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Use the request Host header in the upstream request
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={!isDirty}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isDirty ? 'Save Changes' : 'No Changes'}
        </button>
      </div>
    </form>
  );
}
