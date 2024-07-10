import routesConstants from "@/routes/routesConstants";
import getRoute from "@/routes/utils/getRoute";
import { adminApi } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetUsers,
  setUsersPage,
  setUsersPerPage,
  setUsersSearch,
  setUsersSort,
} from "@/store/slices/usersSlice";
import theme from "@/theme";
import { IRole, IUser } from "@/types/users";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  LinearProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UsersTable.module.scss";

const UsersTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<IUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<IUser[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const {
    meta: { filter, order_by, page, per_page, search, sort },
    data,
    loading,
  } = useAppSelector((state) => state.users);

  const { user } = useAppSelector((state) => state.auth);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<IUser>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        cell: (info) => (info.getValue() as IRole).name,
      },
      {
        accessorKey: "dob",
        cell: (info) => info.getValue(),
      },
      {
        id: "gender",
        accessorFn: (row) => row.gender_text,
        cell: (info) => info.getValue(),
      },
      {
        id: "Status",
        accessorFn: (row) => row.status_text,
        cell: (info) => info.getValue(),
      },
      {
        id: "Actions",
        accessorFn: (row) => row,
        cell: (info) => {
          const data = info.getValue() as IUser;
          return (
            <div className={styles.actions}>
              <span
                onClick={() => {
                  setView(data);
                }}
              >
                <VisibilityIcon />
              </span>
              <span
                onClick={() =>
                  navigate(
                    getRoute([routesConstants.USERS, "edit", data.id], true)
                  )
                }
              >
                <EditIcon />
              </span>
              {user?.id === data.id ? null : (
                <span onClick={() => setDeleteUser([data])}>
                  <DeleteIcon />
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }, [navigate, user?.id]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: per_page,
      },
      sorting: [
        {
          desc: order_by === "desc",
          id: sort,
        },
      ],
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (paginationUpdater) => {
      if (typeof paginationUpdater !== "function") return paginationUpdater;
      const newPagination = paginationUpdater({
        pageIndex: page - 1,
        pageSize: per_page,
      });
      dispatch(setUsersPage(newPagination.pageIndex + 1));
      dispatch(setUsersPerPage(newPagination.pageSize));
    },
    onSortingChange: (sortingUpdater) => {
      if (typeof sortingUpdater !== "function") return sortingUpdater;
      const newSortVal = sortingUpdater([
        { desc: order_by === "desc", id: sort },
      ]);

      dispatch(setUsersSort({ sort: newSortVal[0]?.id || "" }));
    },
    manualSorting: true,
    enableMultiSort: false,
    manualPagination: true,
    enableFilters: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <SearchIcon
          sx={{
            color: theme.palette.secondary.main,
            mr: 1,
            my: 0.5,
          }}
        />
        <TextField
          label="Search"
          variant="standard"
          color="secondary"
          InputLabelProps={{
            style: { fontSize: "13px" },
          }}
          value={search}
          onChange={(e) => {
            dispatch(setUsersSearch(e.target.value));
          }}
        />
      </Box>
      <div className={styles.table_wrap}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div
                        {...{
                          className: classNames(
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            styles.header_cell
                          ),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpwardIcon sx={{ fontSize: "13px" }} />,
                          desc: <ArrowDownwardIcon sx={{ fontSize: "13px" }} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <th colSpan={columns.length}>
                  <LinearProgress />
                  {data?.length ? null : (
                    <Typography className="p-6 text-center tex-[14px]">
                      Loading...
                    </Typography>
                  )}
                </th>
              </tr>
            ) : null}
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {view ? (
        <Modal open={true} onClose={() => setView(null)}>
          <Box className={styles.modal_box}>Details</Box>
        </Modal>
      ) : null}
      {deleteUser.length ? (
        <Modal
          open={true}
          onClose={() => {
            if (isDeleting) return;
            setDeleteUser([]);
          }}
        >
          <Card className={styles.modal_box}>
            <Typography variant="h6" component="h6" className={styles.title}>
              DELETE CONFIRMATION
            </Typography>
            <div className="p-4 pt-0 mt-2 text-[12px] text-[#00000099]">
              {deleteUser.length === 1
                ? "Are you sure you want to delete this record?"
                : `Are you sure you want to delete ${deleteUser.length} items?`}
            </div>
            <div className={styles.btns}>
              <Button
                color="primary"
                variant="contained"
                className={classNames(
                  styles.delete_btn,
                  isDeleting ? "pointer-events-none" : ""
                )}
                onClick={async () => {
                  try {
                    const res = await adminApi.post("/users-delete-multiple", {
                      id: deleteUser.map((x) => x.id),
                    });
                    await res.data;
                    dispatch(resetUsers());
                    setDeleteUser([]);
                    setIsDeleting(false);
                  } catch (e) {
                    console.error(e);
                    dispatch(resetUsers());
                    setDeleteUser([]);
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                className={classNames(
                  styles.cancel_btn,
                  isDeleting ? "pointer-events-none" : ""
                )}
                onClick={() => {
                  setDeleteUser([]);
                  setIsDeleting(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </Modal>
      ) : null}
    </div>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & CheckboxProps) {
  return (
    <Checkbox
      indeterminate={!rest.checked && indeterminate}
      className={classNames(className + " cursor-pointer", styles.checkbox)}
      {...rest}
    />
  );
}

export default UsersTable;
