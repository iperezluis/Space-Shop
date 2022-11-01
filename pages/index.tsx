import type { NextPage } from "next";
import { Typography } from "@mui/material";

import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products";
import { useProducts } from "../hooks";
import { Loading } from "../components/ui/Loading";
import { spaceApi } from "../api";
import { useEffect } from "react";

const HomePage: NextPage = () => {
  const { products, isLoading, isError } = useProducts("/products");

  return (
    <ShopLayout
      title={"Space Shop"}
      pageDescription={"¡Los mejores productos los encuentras aqui!"}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos aqui
      </Typography>
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};
export default HomePage;
