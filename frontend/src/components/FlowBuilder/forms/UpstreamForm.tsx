import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const upstreamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  algorithm: z.enum(['round-robin', 'consistent-hashing', 'least-connections']),
  slots: z.number().min(10).max(65536).optional(),
  hash_on: z.enum(['none', 'consumer', 'ip', 'header', 'cookie', 'path', 'query_arg']).optional(),
  hash_fallback: z.enum(['none', 'consumer', 'ip', 'header', 'cookie', 'path', 'query_arg']).optional(),
});

type UpstreamFormData = z.infer<typeof upstreamSchema>;

interface UpstreamFormProps {
  data: any;
  onSave: (data: UpstreamFormData) => void;
}

export function UpstreamForm({ data, onSave }: UpstreamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpstreamFormData>({
    resolver: zodResolver(upstreamSchema),
    defaultValues: {
      ...data,
      algorithm: data.algorithm || 'round-robin',
      slots: data.slots || 10000,
      hash_on: data.hash_on || 'none',
      hash_fallback: data.hash_fallback || 'none',
    },
  });

  const handleBlur = () => {
    if (isDirty) {
      handleSubmit(onSave)();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  return (
    <form className="space-y-4" onKeyDown={handleKeyDown}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upstream Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="my-upstream"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Load Balancing Algorithm <span className="text-red-500">*</span>
        </label>
        <select
          {...register('algorithm')}
          onChange={(e) => {
            register('algorithm').onChange(e);
            handleBlur();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="round-robin">Round Robin</option>
          <option value="consistent-hashing">Consistent Hashing</option>
          <option value="least-connections">Least Connections</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slots
        </label>
        <input
          type="number"
          {...register('slots', { valueAsNumber: true })}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="10000"
        />
        <p className="text-xs text-gray-500 mt-1">
          Number of slots in the load balancer (10-65536)
        </p>
        {errors.slots && (
          <p className="text-red-500 text-sm mt-1">{errors.slots.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hash On
        </label>
        <select
          {...register('hash_on')}
          onChange={(e) => {
            register('hash_on').onChange(e);
            handleBlur();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="none">None</option>
          <option value="consumer">Consumer</option>
          <option value="ip">IP</option>
          <option value="header">Header</option>
          <option value="cookie">Cookie</option>
          <option value="path">Path</option>
          <option value="query_arg">Query Argument</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          What to use as hashing input (for consistent-hashing)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hash Fallback
        </label>
        <select
          {...register('hash_fallback')}
          onChange={(e) => {
            register('hash_fallback').onChange(e);
            handleBlur();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="none">None</option>
          <option value="consumer">Consumer</option>
          <option value="ip">IP</option>
          <option value="header">Header</option>
          <option value="cookie">Cookie</option>
          <option value="path">Path</option>
          <option value="query_arg">Query Argument</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Fallback hashing method if primary fails
        </p>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-teal-900 mb-1">Upstream Info</h4>
        <p className="text-xs text-teal-700">
          Upstreams represent a virtual hostname and can have multiple targets (backend servers) for load balancing.
        </p>
      </div>

      <div className="text-sm text-gray-500 italic">
        Changes are saved when you click outside the field
      </div>
    </form>
  );
}
