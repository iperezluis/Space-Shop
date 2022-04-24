// import { GetServerSideProps } from "next";
import { useState, useContext } from "react";

import {
  FormControl,
  Grid,
  Select,
  TextField,
  Typography,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
import { useForm } from "react-hook-form";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { CartContext } from "../../context";

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  country: string;
  city: string;
  zip: string;
  phone: string;
};
const getAddressFromCookies = () => {
  return {
    firstName: Cookie.get("firstName") || "",
    lastName: Cookie.get("lastName") || "",
    address: Cookie.get("address") || "",
    address2: Cookie.get("address2") || "",
    country: Cookie.get("country") || "",
    city: Cookie.get("city") || "",
    zip: Cookie.get("zip") || "",
    phone: Cookie.get("phone") || "",
  };
};

const AddressPage = () => {
  const { updateShippingAddres, shippingAddress } = useContext(CartContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    updateShippingAddres(data);

    router.push("/checkout/summary");
  };
  return (
    <ShopLayout
      title={"Direccion"}
      pageDescription={"Confirmar direccion del destino"}
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "This field is required",
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "This field is required",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "This field is required",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion 2 (Opcional)"
              variant="filled"
              fullWidth
              {...register("address2", {})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Codigo Postal"
              variant="filled"
              fullWidth
              {...register("zip", {
                required: "This field is required",
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "This field is required",
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="Pais"
                key={Cookie.get("country") || countries.countries[0].code}
                defaultValue={
                  Cookie.get("country") || countries.countries[0].code
                }
                {...register("country", {
                  required: "This field is required",
                })}
                error={!!errors.country}
                // helperText={errors.country?.message}
              >
                {countries.countries.map((c) => {
                  return (
                    <MenuItem key={c.code} value={c.code}>
                      {c.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "This field is required",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//we validate since the server side if the user is authenticated
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { token = "" } = ctx.req.cookies;
//   let isValidToken = false;
//   try {
//     await jwt.verifyJWT(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }
//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: "/auth/login?p=/checkout/address",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
export default AddressPage;
