import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item, index) => (
          <li key={item.href}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600"
                aria-hidden="true"
              />
              <Link
                href={item.href}
                className={`ml-4 text-sm font-medium ${
                  index === items.length - 1
                    ? 'text-gray-700 dark:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
