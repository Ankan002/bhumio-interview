import { Avatar } from "@/components/ui/avatar";
import { PaginatedDataItem } from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";
import BoringAvatar from "boring-avatars";

export const paginatedTableColumns: ColumnDef<PaginatedDataItem>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        header: "Avatar",
        cell: ({ row }) => {
            return (
                <Avatar className="h-10 w-10 rounded-lg">
                    <BoringAvatar name={row.original.email} />
                </Avatar>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
];
