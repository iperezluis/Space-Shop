import React, { useState } from "react";

import { GetServerSideProps, NextPage } from "next";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  Box,
  Chip,
} from "@mui/material";
import { CartList, OrderSummary } from "../../../components/cart";
import {
  ConfirmationNumberOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces/order";
import { AdminLayout } from "../../../components/layouts";

interface Props {
  order: IOrder;
}
const SummaryPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress, numberOfItems } = order;

  return (
    <AdminLayout
      title={"Seguimiento de la orden"}
      subtitle={`OrdenId: ${order._id}`}
      icon={<ConfirmationNumberOutlined />}
    >
      <Box sx={{ width: "50%" }}>
        {order.isPaid ? (
          <Chip
            sx={{ my: 2 }}
            variant="outlined"
            label="Orden ya fue agada"
            color="success"
            icon={<CreditScoreOutlined />}
          />
        ) : (
          <Chip
            sx={{ my: 2, flex: 1 }}
            variant="outlined"
            label="Pendiente de pago"
            color="error"
            icon={<CreditCardOffOutlined />}
          />
        )}
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList editable={false} products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>
                Resumen:
                {numberOfItems} {numberOfItems > 1 ? " Productos" : " Producto"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>
                {shippingAddress.address}{" "}
                {shippingAddress.address2 ? `,${shippingAddress.address2}` : ""}
              </Typography>
              <Typography>{shippingAddress.zip}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />
              <OrderSummary order={order} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box sx={{ display: "flex", flex: 1 }} flexDirection="column">
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      variant="outlined"
                      label="Orden ya fue agada"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2 }}
                      variant="outlined"
                      label="Orden pendiente de pago"
                      color="error"
                      icon={<CreditScoreOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  //to check if user is loggin
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }
  // to check if order exist
  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/admin/orders",
        permanent: false,
      },
    };
  }

  return {
    props: { order },
  };
};
export default SummaryPage;
