import { useEffect, useContext, useState } from "react";
import NextLink from "next/link";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  Box,
  Button,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import Cookie from "js-cookie";
import { CartContext } from "../../context";
import { countries } from "../../utils/countries";
import { useRouter } from "next/router";
import { Chip } from "@mui/material";

const SummaryPage = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    shippingAddress,
    createOrder,
    orderSummary: { numberOfItems },
  } = useContext(CartContext);

  //to validate if address exist
  const router = useRouter();
  useEffect(() => {
    if (!Cookie.get("firstName")) {
      router.push("/checkout/address");
    }
  }, [router]);

  //if shippinaddress not exist then return empthy fragment
  if (!shippingAddress) {
    return <></>;
  }
  const { address, address2, phone, city, country, zip, firstName, lastName } =
    shippingAddress;

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${message}`);
  };

  return (
    <ShopLayout
      title={"Resumen de la órden"}
      pageDescription={"Resumen de la orden "}
    >
      <Typography variant="h1" component="h1">
        Resumen de la órden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>
                Resumen: {numberOfItems}{" "}
                {numberOfItems === 1 ? "Producto" : "Productos"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>

                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ""}
              </Typography>
              <Typography>{city + ", " + zip}</Typography>
              <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography>

              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default SummaryPage;
