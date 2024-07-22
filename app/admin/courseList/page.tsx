"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RequestPrefix, domain } from "@/app/utils/request";

export type CourseType = "Live" | "Record";

export type Course = {
  id: string;
  name: string;
  tags: Array<string>;
  type: CourseType;
};

const fetchCourses = async () => {
  const response = await fetch(`${RequestPrefix}/course-list`);
  const data = await response.json();
  return data.map((course: any) => ({
    id: course.id.toString(),
    name: course.courseTitle,
    tags: course.tags.map((tag: any) => tag.label),
    type: course.type,
  }));
};

export default function CourseList() {
  const [data, setData] = useState<Course[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    fetchCourses().then(setData);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${RequestPrefix}/course-list/${id}`, {
      method: "DELETE",
    });
    setData(data.filter((course) => course.id !== id));
  };

  const handleEdit = (id: string) => {
    window.open(`${domain}/admin/courseDetail?id=${id}`, "_blank");
  };

  const handleViewComments = (id: string) => {
    window.open(`${domain}/admin/courseComments?courseId=${id}`, "_blank");
  };

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-right">Id</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-right">Name</div>,
      cell: ({ row }) => (
        <div className="lowercase text-right">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "tags",
      header: () => <div className="text-right">Tags</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {(row.getValue("tags") as Array<string>)?.map?.((value: string) => (
            <Badge key={`tag-${value}`} className="mr-1">
              {value}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="text-right">Type</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("type")}</div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const courseId = row.getValue("id") as string;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDelete(courseId)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(courseId)}>
                  Edit/Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewComments(courseId)}>
                  View Comments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Search Course Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
