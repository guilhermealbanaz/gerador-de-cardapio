import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { MenuService } from '@/services/menu.service';
import { Item } from '@/types';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ItemFormProps {
  menuId: string;
  categoryId: string;
  item?: Item;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  menuId,
  categoryId,
  item,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price.toString() || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(item?.imageUrl || '');

  const createMutation = useMutation(
    (data: Partial<Item>) => MenuService.createItem(categoryId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', menuId]);
        toast.success('Item created successfully');
        onClose();
      },
      onError: () => {
        toast.error('Failed to create item');
      },
    }
  );

  const updateMutation = useMutation(
    (data: Partial<Item>) => MenuService.updateItem(item!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', menuId]);
        toast.success('Item updated successfully');
        onClose();
      },
      onError: () => {
        toast.error('Failed to update item');
      },
    }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      price: parseFloat(price),
      categoryId,
    };

    if (item) {
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
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
          >
            {item ? 'Edit Item' : 'New Item'}
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
            <div>
              <label htmlFor="price" className="label">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input mt-1"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="label">Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
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
                  : item
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
