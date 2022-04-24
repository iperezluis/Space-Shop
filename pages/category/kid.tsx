import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Loading } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title={"SpaceShop-Niños"}
      pageDescription={"Los mejores accesorios de Space para niños"}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Kids
      </Typography>
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};
export default KidPage;
