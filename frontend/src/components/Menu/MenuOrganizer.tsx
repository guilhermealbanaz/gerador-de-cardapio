import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import { MenuService } from '@/services/menu.service';
import { Menu, Category, Item } from '@/types';
import { toast } from 'react-hot-toast';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
} from '@heroicons/react/24/outline';
import { CategoryForm } from './CategoryForm';
import { ItemForm } from './ItemForm';

interface MenuOrganizerProps {
  menu: Menu;
}

export const MenuOrganizer: React.FC<MenuOrganizerProps> = ({ menu }) => {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(menu.categories.map((c) => c.id))
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addingItemToCategory, setAddingItemToCategory] = useState<string | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<{
    item: Item;
    categoryId: string;
  } | null>(null);

  const updateCategoryOrderMutation = useMutation(
    MenuService.updateCategoriesOrder,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', menu.id]);
        toast.success('Menu organization updated');
      },
    }
  );

  const updateItemOrderMutation = useMutation(MenuService.updateItemsOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu', menu.id]);
      toast.success('Items reordered successfully');
    },
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'category') {
      const categories = Array.from(menu.categories);
      const [removed] = categories.splice(source.index, 1);
      categories.splice(destination.index, 0, removed);

      updateCategoryOrderMutation.mutate({
        menuId: menu.id,
        categories: categories.map((cat, index) => ({
          ...cat,
          order: index,
        })),
      });
    } else if (type === 'item') {
      const sourceCategory = menu.categories.find(
        (c) => c.id === source.droppableId
      );
      const destCategory = menu.categories.find(
        (c) => c.id === destination.droppableId
      );

      if (!sourceCategory || !destCategory) return;

      const sourceItems = Array.from(sourceCategory.items);
      const [removed] = sourceItems.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceItems.splice(destination.index, 0, removed);
        updateItemOrderMutation.mutate({
          menuId: menu.id,
          items: sourceItems.map((item, index) => ({
            ...item,
            order: index,
          })),
        });
      } else {
        const destItems = Array.from(destCategory.items);
        destItems.splice(destination.index, 0, {
          ...removed,
          categoryId: destCategory.id,
        });
        updateItemOrderMutation.mutate({
          menuId: menu.id,
          items: destItems.map((item, index) => ({
            ...item,
            order: index,
            categoryId: destCategory.id,
          })),
        });
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddingCategory(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>

          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {menu.categories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="p-4 flex items-center space-x-4">
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400"
                          >
                            <GripVertical className="h-6 w-6" />
                          </div>
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="text-gray-500"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {category.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setAddingItemToCategory(category.id)}
                              className="btn-secondary text-sm"
                            >
                              Add Item
                            </button>
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="btn-secondary text-sm"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {expandedCategories.has(category.id) && (
                          <Droppable
                            droppableId={category.id}
                            type="item"
                          >
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="p-4 space-y-2 border-t dark:border-gray-700"
                              >
                                {category.items.map((item, index) => (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-gray-50 dark:bg-gray-700 p-3 rounded flex items-center space-x-4 ${
                                          snapshot.isDragging
                                            ? 'shadow-lg'
                                            : ''
                                        }`}
                                      >
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                        <div className="flex-1">
                                          <h4 className="font-medium">
                                            {item.name}
                                          </h4>
                                          {item.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-lg font-semibold">
                                          R$ {item.price.toFixed(2)}
                                        </div>
                                        <button
                                          onClick={() =>
                                            setEditingItem({
                                              item,
                                              categoryId: category.id,
                                            })
                                          }
                                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        )}
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

      {/* Forms */}
      {isAddingCategory && (
        <CategoryForm
          menuId={menu.id}
          isOpen={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
        />
      )}

      {editingCategory && (
        <CategoryForm
          menuId={menu.id}
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {addingItemToCategory && (
        <ItemForm
          menuId={menu.id}
          categoryId={addingItemToCategory}
          isOpen={!!addingItemToCategory}
          onClose={() => setAddingItemToCategory(null)}
        />
      )}

      {editingItem && (
        <ItemForm
          menuId={menu.id}
          categoryId={editingItem.categoryId}
          item={editingItem.item}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
};
