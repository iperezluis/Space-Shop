import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Loading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");

  return (
    <ShopLayout
      title={"SpaceShop-Hombres"}
      pageDescription={"Los mejores accesorios de Space para hombres"}
    >
      <Typography variant="h1" component="h1">
        Hombres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para ellos
      </Typography>
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};
export default MenPage;
