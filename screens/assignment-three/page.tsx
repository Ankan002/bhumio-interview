"use client";

import { Button } from "@/components/ui/button";
import { DashboardProvider } from "@/components/providers/dashboard-provider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useAssignmentThree } from "./hook";
import { paginatedTableColumns } from "./table";

const AssignmentThreeScreen = () => {
    const { data, page, isMoreData, isLoading, loadNextPage, resetPagination } =
        useAssignmentThree();

    const table = useReactTable({
        data,
        columns: paginatedTableColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DashboardProvider heading="Broken Pagination">
            <p className="text-sm text-muted-foreground mb-4">
                This is a broken pagination that will return a different number
                of items on each page. [This is the third assignment for Bhumio]
            </p>

            <div className="w-full flex flex-col gap-4 pb-6">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading && data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={paginatedTableColumns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={paginatedTableColumns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No rows yet. Load the first page.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {isMoreData ? (
                        <Button
                            variant="default"
                            onClick={loadNextPage}
                            disabled={!isMoreData || isLoading}
                        >
                            {isLoading ? "Loading…" : "Load more"}
                        </Button>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No more data
                        </p>
                    )}
                </div>
            </div>
        </DashboardProvider>
    );
};

export default AssignmentThreeScreen;
