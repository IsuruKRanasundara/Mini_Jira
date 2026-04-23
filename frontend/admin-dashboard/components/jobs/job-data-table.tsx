"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { JobAd } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";

interface JobDataTableProps {
  data: JobAd[];
  onBulkArchive: (ids: string[]) => void;
}

export function JobDataTable({ data, onBulkArchive }: JobDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const columns = useMemo<ColumnDef<JobAd>[]>(
    () => [
      {
        id: "select",
        header: () => <input aria-label="Select all rows" type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? pagedData.map((job) => job.id) : [])} />,
        cell: ({ row }) => (
          <input
            aria-label={`Select ${row.original.id}`}
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={(e) => {
              const id = row.original.id;
              setSelectedIds((prev) => (e.target.checked ? [...prev, id] : prev.filter((item) => item !== id)));
            }}
          />
        ),
      },
      { accessorKey: "id", header: "Job ID" },
      {
        accessorKey: "title",
        header: "Job title",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.companyName}</p>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "salaryRange", header: "Salary" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => <Badge variant={row.original.priority === "urgent" ? "danger" : "secondary"}>{row.original.priority}</Badge>,
      },
      { accessorKey: "assignedReviewer", header: "Reviewer" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="icon" aria-label="Row actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuItem onClick={() => {}}>
              <Link href={`/admin/jobs/${row.original.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Approve</DropdownMenuItem>
            <DropdownMenuItem>Reject</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem>Assign reviewer</DropdownMenuItem>
            <DropdownMenuItem>Mark featured</DropdownMenuItem>
            <DropdownMenuItem>Duplicate ad</DropdownMenuItem>
          </DropdownMenu>
        ),
      },
    ],
    [pagedData, selectedIds]
  );

  const table = useReactTable({
    data: pagedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
  });

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{selectedIds.length} selected</p>
        <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => onBulkArchive(selectedIds)}>
          Bulk archive
        </Button>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
