import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { MenuService } from '@/services/menu.service';
import { Category } from '@/types';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

interface CategoryFormProps {
  menuId: string;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  menuId,
  category,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(category?.name || '');
  const [description, setDescription] = React.useState(category?.description || '');

  const createMutation = useMutation(
    (data: Partial<Category>) => MenuService.createCategory(menuId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', menuId]);
        toast.success('Category created successfully');
        onClose();
      },
      onError: () => {
        toast.error('Failed to create category');
      },
    }
  );

  const updateMutation = useMutation(
    (data: Partial<Category>) =>
      MenuService.updateCategory(category!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', menuId]);
        toast.success('Category updated successfully');
        onClose();
      },
      onError: () => {
        toast.error('Failed to update category');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, description };
    
    if (category) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
          >
            {category ? 'Edit Category' : 'New Category'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input mt-1"
                rows={3}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                {createMutation.isLoading || updateMutation.isLoading
                  ? 'Saving...'
                  : category
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
