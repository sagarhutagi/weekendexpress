"use client";

import { useMemo } from 'react';
import type { Workshop, Category, Tag } from '@/lib/types';
import { DataTable } from './data-table';
import { columns as getColumns } from './columns';

interface WorkshopsTableProps {
  data: Workshop[];
  categories: Category[];
  tags: Tag[];
}

export function WorkshopsTable({ data, categories, tags }: WorkshopsTableProps) {
  const columns = useMemo(() => getColumns({ categories, tags }), [categories, tags]);
  return <DataTable columns={columns} data={data} />;
}
