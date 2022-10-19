import React, { useState } from "react";

import { GetServerSideProps, NextPage } from "next";

import NextLink from "next/link";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  Box,
  Alert,
  AlertTitle,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder, ISession } from "../../interfaces/order";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { spaceApi } from "../../api";

type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
  session: ISession;
}
const SummaryPage: NextPage<Props> = ({ order, session }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { shippingAddress, numberOfItems } = order;
  const { user } = session;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("no hay pago en paypal");
    }
    setIsLoading(true);
    try {
      const { data } = await spaceApi.post("/orders/payment", {
        transactionId: details.id,
        orderId: order._id,
      });
      router.reload();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("Error");
    }
  };
  return (
    <ShopLayout
      title={`Resumen de la órden ${order._id}`}
      pageDescription={"Resumen de la orden "}
    >
      {order.isPaid && (
        <Alert severity="success">
          <AlertTitle>Compra exitosa</AlertTitle>¡ Tu compra ha sido realizada
          exitosamente!—{" "}
          <strong>
            {`Te enviamos un correo electronico a ${user.email} con el status de la
            compra!`}
          </strong>
        </Alert>
      )}
      <Typography variant="h1" component="h1">
        Orden: {order._id}
      </Typography>
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
          label="Pendiente de pago"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}
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
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isLoading ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  sx={{ display: isLoading ? "none" : "flex", flex: 1 }}
                  flexDirection="column"
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      variant="outlined"
                      label="Orden ya fue agada"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        await actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                          console.log({ details });
                          const name = details.payer.name!.given_name;
                          console.log({ data });
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
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
        destination: "/orders/history",
        permanent: false,
      },
    };
  }
  //to check if the order belong to this user
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: { order, session },
  };
};
export default SummaryPage;
