import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { MenuService } from '@/services/menu.service';
import { Layout } from '@/components/Layout/Layout';
import { MenuOrganizer } from '@/components/Menu/MenuOrganizer';
import { Breadcrumb } from '@/components/Common/Breadcrumb';

export default function OrganizeMenuPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: menu, isLoading } = useQuery(
    ['menu', id],
    () => MenuService.getMenu(id as string),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!menu) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: 'Menus', href: '/menus' },
            { label: menu.name, href: `/menus/${menu.id}` },
            { label: 'Organize', href: `/menus/${menu.id}/organize` },
          ]}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organize Menu: {menu.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop categories and items to organize your menu.
            </p>
          </div>
        </div>

        <MenuOrganizer menu={menu} />
      </div>
    </Layout>
  );
}
