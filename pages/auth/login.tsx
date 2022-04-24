import React, { useState, useContext, useEffect } from "react";
import { GetServerSideProps } from "next";

import NextLink from "next/link";
import { getSession, signIn, getProviders } from "next-auth/react";

import {
  Link,
  Box,
  Button,
  Grid,
  Divider,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import {
  ErrorOutline,
  GitHub,
  AccountCircle,
  Audiotrack,
} from "@mui/icons-material";

import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import { useRouter } from "next/router";

type FormData = {
  email: string;
  password: string;
};
const LoginPage = () => {
  // const { loginUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const router = useRouter();

  // load providers
  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
    console.log(providers);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  console.log({ errors });

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    // const isValidUser = await loginUser(email, password);
    // if (!isValidUser) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }
    // //the property replace is for what that user can't back to before page
    // //redirect to user to page that was seeing using query params
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box
          sx={{
            width: 350,
            padding: "10px 20px ",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesion
              </Typography>
              <Chip
                label="Credentials not valids"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 1 }}>
              <TextField
                type="email"
                label="Email"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "This field is required",
                  validate: validations.isEmail,
                })}
                // just on this case remember that an exclamation mark mean  "if the value not exist" and two exclamations marks mean "if the values exists"
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
                startIcon={<AccountCircle />}
              >
                Ingresar
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
                    ? `/auth/register?p=${router.query.p}`
                    : "/auth/register"
                }
                passHref
              >
                <Link underline="always">
                  <Typography>¿No tienes Cuenta?</Typography>
                  <Typography textAlign="center">¡Registrate Aqui!</Typography>
                </Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Divider sx={{ width: "100%", mb: 2 }}>OR</Divider>
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials") return <div></div>;
                return (
                  <Button
                    fullWidth
                    className="circular-btn"
                    sx={{ mb: 1, padding: "6px" }}
                    color="primary"
                    key={provider.id}
                    onClick={() => signIn(provider.id)}
                    startIcon={
                      provider.id === "github" ? <GitHub /> : <Audiotrack />
                    }
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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
export default LoginPage;
