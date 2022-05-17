import NextLink from "next/link";
import { GetServerSideProps, NextPage } from "next";

import { Typography, Grid, Chip, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layouts";
import { getSession } from "next-auth/react";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },

  {
    field: "paid",
    headerName: "Status",
    description: "Muestra informacion si la orden esta pagada  o no",
    width: 300,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip
          color="success"
          label="Órden pagada exitosamente"
          variant="outlined"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          color="error"
          label="Órden pendiente de pago"
          variant="outlined"
          icon={<CreditCardOffOutlined />}
        />
      );
    },
  },
  {
    field: "Orden",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.Orden}`} passHref>
          <Link underline="always">{params.row.Orden}</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
  username: string;
}
const HistoryPage: NextPage<Props> = ({ orders, username }) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    paid: order.isPaid,
    Orden: order._id,
  }));
  return (
    <ShopLayout title={"Historial"} pageDescription={"Historial de ordenes"}>
      <Typography variant="h1" component="h1">
        Historial de órdenes
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[0]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }
  const orders = await dbOrders.getOrderByUser(session.user._id);

  return {
    props: { orders },
  };
};
export default HistoryPage;
