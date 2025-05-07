import { Category } from './category';

export interface CategoryTree {
    id: number;
    name: string;
    parentId: number | null;
    parent?: CategoryTree;
    children: CategoryTree[];
    level: number;
  }