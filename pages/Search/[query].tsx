import { GetServerSideProps, NextPage } from "next";

import { Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Loading } from "../../components/ui";
import { useProducts } from "../../hooks";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces/products";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}
const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  // const router = useRouter();
  // const { products, isLoading } = useProducts(`/search/${router.query.query}`);
  return (
    <ShopLayout
      title={"Space Shop"}
      pageDescription={"Los mejores productos los encuentras aqui"}
    >
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>
      {foundProducts ? (
        <>
          <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
            Resultados para: <strong>{query}</strong>
          </Typography>
        </>
      ) : (
        <Box display="flex" sx={{ mb: 3 }}>
          <Typography variant="h2" component="h2">
            No encontramos ningun producto para:{" "}
          </Typography>
          <Typography variant="h2" component="h2">
            <strong>{query}</strong>
          </Typography>
        </Box>
      )}
      {/* {isLoading ? <Loading /> : <ProductList products={products} />}
       */}
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };
  if (query.length === 0) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  //ponemos un let para hacer un condicional por las cookies
  let products = await dbProducts.getProductsByQuery(query);
  const foundProducts = products.length > 0;
  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }
  //TO DO
  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};
export default SearchPage;
