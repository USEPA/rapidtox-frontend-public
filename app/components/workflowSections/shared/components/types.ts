import type {RouteLocationRaw} from 'vue-router';

interface LinkProps {
  href: string | undefined;
  replace: boolean | undefined;
  to: RouteLocationRaw | undefined;
  exact: boolean | undefined;
}
export type InternalBreadcrumbItem = Partial<LinkProps> & {
  title: string;
  disabled?: boolean;
};

export type BreadcrumbItem = string | InternalBreadcrumbItem;
