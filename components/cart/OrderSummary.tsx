import React, { FC, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from "../../context";
import { currency } from "../../utils";
import { IOrder } from "../../interfaces";

interface Props {
  order?: IOrder;
}
export const OrderSummary: FC<Props> = ({ order }) => {
  const { orderSummary } = useContext(CartContext);
  // const orderSummary =  orderSummary || order;
  const orderValues = order ? order : orderSummary;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>productos: {orderValues.numberOfItems}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(orderValues.subTotalPay)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE)})%
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(orderValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {currency.format(orderValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
