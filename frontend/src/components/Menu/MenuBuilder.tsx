import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { MenuService } from '@/services/menu.service';
import { Menu, Category, Item } from '@/types';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MenuBuilderProps {
  menuId: string;
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({ menuId }) => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const { data: menu, isLoading } = useQuery(['menu', menuId], () =>
    MenuService.getMenu(menuId)
  );

  const updateCategoryOrderMutation = useMutation(MenuService.updateCategoriesOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menuId]);
      toast.success('Categories reordered successfully');
    },
  });

  const updateItemOrderMutation = useMutation(MenuService.updateItemsOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menuId]);
      toast.success('Items reordered successfully');
    },
  });

  const deleteItemMutation = useMutation(MenuService.deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menuId]);
      toast.success('Item deleted successfully');
    },
  });

  const deleteCategoryMutation = useMutation(MenuService.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menuId]);
      toast.success('Category deleted successfully');
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    if (sourceDroppableId === 'categories') {
      const categories = Array.from(menu.categories);
      const [reorderedCategory] = categories.splice(result.source.index, 1);
      categories.splice(result.destination.index, 0, reorderedCategory);

      updateCategoryOrderMutation.mutate({
        menuId,
        categories: categories.map((cat, index) => ({ ...cat, order: index })),
      });
    } else {
      const sourceCategory = menu.categories.find((c) => c.id === sourceDroppableId);
      const destinationCategory = menu.categories.find(
        (c) => c.id === destinationDroppableId
      );

      if (sourceCategory && destinationCategory) {
        const sourceItems = Array.from(sourceCategory.items);
        const [movedItem] = sourceItems.splice(result.source.index, 1);

        if (sourceDroppableId === destinationDroppableId) {
          sourceItems.splice(result.destination.index, 0, movedItem);
          updateItemOrderMutation.mutate({
            menuId,
            items: sourceItems.map((item, index) => ({ ...item, order: index })),
          });
        } else {
          const destinationItems = Array.from(destinationCategory.items);
          destinationItems.splice(result.destination.index, 0, {
            ...movedItem,
            categoryId: destinationCategory.id,
          });
          updateItemOrderMutation.mutate({
            menuId,
            items: destinationItems.map((item, index) => ({ ...item, order: index })),
          });
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{menu.name}</h2>
          <button
            onClick={() => {/* Implement add category */}}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>

        <Droppable droppableId="categories" type="category">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {menu.categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-4 border-b dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingCategory(category.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <Droppable droppableId={category.id} type="item">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-4 space-y-2"
                          >
                            {category.items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded flex items-center justify-between"
                                  >
                                    <div>
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <div className="text-lg font-semibold">
                                        R$ {item.price.toFixed(2)}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => setEditingItem(item.id)}
                                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => deleteItemMutation.mutate(item.id)}
                                          className="p-1 text-red-500 hover:text-red-700"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <button
                              onClick={() => {/* Implement add item */}}
                              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center"
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add Item
                            </button>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
