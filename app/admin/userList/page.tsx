"use client";

import * as React from "react";
import { ChevronsUpDown, ChevronDown, Ellipsis } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { DataTableFacetedFilter } from "../components/table-faceted-filter";
import EditUserDialog from "./components/editUserDialog";
import { User } from "./utils/type";

const API_URL = "http://localhost:3001/api/users";

export const roles = [
  {
    value: "teacher",
    label: "teacher",
  },
  {
    value: "student",
    label: "student",
  },
  {
    value: "admin",
    label: "admin",
  },
];

export default function UserList() {
  const [data, setData] = React.useState<User[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleResetPassword = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: "123456" }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedUser = await response.json();
      setData((prevData) =>
        prevData.map((user) => (user.id === userId ? updatedUser : user))
      );
      console.log(`Reset password for user ${userId}`);
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setData((prevData) => prevData.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-right">Id</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="float-right"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase text-right">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "userName",
      header: () => <div className="text-right">Name</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => <div className="text-right">Role</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue("role")}</div>
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
        const user = row.original;

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
                <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                  Update/View Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                  Delete
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

  const handleSaveUser = async (user: User) => {
    try {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedUser = await response.json();
      setData((prevData) =>
        prevData.map((u) => (u.id === user.id ? updatedUser : u))
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="role"
            options={roles}
          />
        )}
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveUser}
      />
    </>
  );
}
