import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const consumerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  custom_id: z.string().optional(),
});

type ConsumerFormData = z.infer<typeof consumerSchema>;

interface ConsumerFormProps {
  data: any;
  onSave: (data: ConsumerFormData) => void;
}

export function ConsumerForm({ data, onSave }: ConsumerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ConsumerFormData>({
    resolver: zodResolver(consumerSchema),
    defaultValues: data,
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
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('username')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="user@example.com"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom ID (optional)
        </label>
        <input
          type="text"
          {...register('custom_id')}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="custom-identifier"
        />
        <p className="text-xs text-gray-500 mt-1">
          A custom identifier for this consumer
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-green-900 mb-1">Consumer Info</h4>
        <p className="text-xs text-green-700">
          Consumers represent API clients or users. You can attach credentials and plugins to consumers for authentication and authorization.
        </p>
      </div>

      <div className="text-sm text-gray-500 italic">
        Changes are saved when you click outside the field
      </div>
    </form>
  );
}
