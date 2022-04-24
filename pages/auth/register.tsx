import React, { useState, useContext } from "react";
import { GetServerSideProps } from "next";

import { getSession, signIn } from "next-auth/react";

import NextLink from "next/link";
import {
  Link,
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import { AuthLayout } from "../../components/layouts";
import { ErrorOutline, HowToReg } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import spaceApi from "../../api/spaceApi";
import { AuthContext } from "../../context/auth/";
import { useRouter } from "next/router";

type FormData = {
  name: string;
  email: string;
  password: string;
};
const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    //the property replace is for what that user can't back to before page
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    await signIn("credentials", { email, password });
  };
  return (
    <AuthLayout title="Registrase">
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px " }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip
                label="Este email ya esta registrado"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 1 }}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "This field is required",
                  minLength: { value: 2, message: "Min 2 characters " },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="text"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "This field is required",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "This field is required",
                  minLength: { value: 6, message: "Min 6 characters " },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sx={{ my: 1 }}>
              <Button
                type="submit"
                color="primary"
                className="circular-btn"
                size="large"
                fullWidth
                startIcon={<HowToReg />}
              >
                Crear cuenta
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : "/auth/login"
                }
                passHref
              >
                <Link underline="always">
                  <Typography>¿Ya tienes Cuenta?</Typography>
                  <Typography textAlign="center">¡Ingresa aqui!</Typography>
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  //with the session we can check if the user is atuhenticated or not and so we protect the routes and redirect them
  const session = await getSession({ req });
  //we use the parameters for redirect to users to page that them were seeing
  // we put "/" per default
  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
export default RegisterPage;
