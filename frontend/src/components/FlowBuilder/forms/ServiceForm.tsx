import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  protocol: z.enum(['http', 'https', 'grpc', 'grpcs', 'tcp', 'tls', 'udp']),
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1).max(65535),
  path: z.string().optional(),
  retries: z.number().min(0).optional(),
  connect_timeout: z.number().min(0).optional(),
  write_timeout: z.number().min(0).optional(),
  read_timeout: z.number().min(0).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  data: any;
  onSave: (data: ServiceFormData) => void;
}

export function ServiceForm({ data, onSave }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: data,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const onSubmit = (formData: ServiceFormData) => {
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" onKeyDown={handleKeyDown}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="my-service"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Protocol <span className="text-red-500">*</span>
        </label>
        <select
          {...register('protocol')}
          onChange={(e) => {
            register('protocol').onChange(e);
            handleBlur();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
          <option value="grpc">gRPC</option>
          <option value="grpcs">gRPCs</option>
          <option value="tcp">TCP</option>
          <option value="tls">TLS</option>
          <option value="udp">UDP</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Host <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('host')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="api.example.com"
        />
        {errors.host && (
          <p className="text-red-500 text-sm mt-1">{errors.host.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Port <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register('port', { valueAsNumber: true })}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="80"
        />
        {errors.port && (
          <p className="text-red-500 text-sm mt-1">{errors.port.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Path (optional)
        </label>
        <input
          type="text"
          {...register('path')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="/v1"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Retries</label>
            <input
              type="number"
              {...register('retries', { valueAsNumber: true })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Connect Timeout (ms)
            </label>
            <input
              type="number"
              {...register('connect_timeout', { valueAsNumber: true })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60000"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Write Timeout (ms)
            </label>
            <input
              type="number"
              {...register('write_timeout', { valueAsNumber: true })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60000"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Read Timeout (ms)
            </label>
            <input
              type="number"
              {...register('read_timeout', { valueAsNumber: true })}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60000"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 italic">
        Changes are saved when you click outside the field
      </div>
    </form>
  );
}
