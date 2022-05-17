import React from "react";

import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";

import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Order ID",
    width: 250,
  },
  {
    field: "email",
    headerName: "Correo",
    width: 230,
  },
  {
    field: "name",
    headerName: "Nombre completo",
    width: 200,
  },
  {
    field: "total",
    headerName: "Monto Total",
    width: 100,
  },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip label="Pagada" variant="outlined" color="success" />
      ) : (
        <Chip label="Pendiente" variant="outlined" color="error" />
      );
    },
    width: 110,
  },
  {
    field: "noProducts",
    headerName: "N° de productos",
    align: "center",
    width: 100,
  },
  {
    field: "check",
    headerName: "Ver Orden",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      );
    },
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Creada en: ",
    width: 250,
  },
];
const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) return <></>;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));
  return (
    <AdminLayout
      title={"Ordenes"}
      subtitle={"Mantenimiento de ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
