import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Loading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"SpaceShop-Mujeres"}
      pageDescription={"Los mejores accesorios de Space para mujeres"}
    >
      <Typography variant="h1" component="h1">
        Mujeres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para ellas
      </Typography>
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};
export default WomenPage;
