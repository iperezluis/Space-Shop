import { Box, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../components/layouts";

const Custom404 = () => {
  return (
    <ShopLayout
      title={"Page Not Found"}
      pageDescription={"No hay nada que encontrar aqui"}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Typography variant="h6" component="h6" fontSize={70} fontWeight={200}>
          404 |
        </Typography>
        <Typography fontSize={20}>
          No encontramos ninguna pagina aqui
        </Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
