import React, { useState, MouseEvent, useContext } from "react";

import { useRouter } from "next/router";
import {
  GetServerSideProps,
  NextPage,
  GetStaticPaths,
  GetStaticProps,
} from "next";

import { ShopLayout } from "../../components/layouts";
import { ItemCounter } from "../../components/ui";
import { ProductSlideShow, SizeSelector } from "../../components/products";

import { Grid, Box, Typography, Button, Chip } from "@mui/material";
import { useProducts } from "../../hooks";
import { IProduct, IProductCart, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { CartContext } from "../../context/cart/CartContext";

interface Props {
  product: IProduct;
}
const ProductPage: NextPage<Props> = ({ product }) => {
  // #Nota: el router y el useProducts lo podriamos usar para traernos la info mendiante AJAX pero no vamos a tener SEO porque cuando lleguen los bots de google a checkar no van a conseguir ni titulo ni nada porque no ha cargado la info asi que vamos a pregenerarlos getServerSideProps
  // const router = useRouter();
  // const { products: product, isLoading } = useProducts(
  //   `/products/${router.query.slug}`
  // );
  const [tempCartProduct, setTempCartProduct] = useState<IProductCart>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    sizes: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  const router = useRouter();
  const { addProductToCart, cart } = useContext(CartContext);

  const sizeSelected = (size: ISize) => {
    console.log(size);
    setTempCartProduct({
      ...tempCartProduct,
      sizes: size,
    });
  };
  const updateQuantifies = (value: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity: value,
    });
  };
  const addProduct = () => {
    if (!tempCartProduct.sizes) return;
    addProductToCart(tempCartProduct);
    router.push("/cart");
    // console.log({ ...tempCartProduct });
    // console.log([...cart]);
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* Silder image */}
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* titles */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {"$" + product.price}
            </Typography>
            {/* cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" component="h2">
                Cantidad
              </Typography>
              {/* counter products */}
              <ItemCounter
                maxValue={product.inStock}
                currentValue={tempCartProduct.quantity}
                updateQuantity={(value) => updateQuantifies(value)}
              />
              <SizeSelector
                selectedSize={tempCartProduct.sizes}
                sizes={product.sizes}
                onSelectedSize={(size) => sizeSelected(size)}
              />
            </Box>
            {/* Add to cart */}
            {product.inStock > 0 ? (
              <Button
                onClick={addProduct}
                color="secondary"
                className="circular-btn"
              >
                {tempCartProduct.sizes
                  ? "Agregar al carrito"
                  : "seleccione una talla"}
              </Button>
            ) : (
              <Chip
                label="no hay disponibles"
                color="error"
                variant="outlined"
              />
            )}
            {/* description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//no usar esto...SSR
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   // const { data } = await  // your fetch function here
//   const { slug } = ctx.params as { slug: string };

//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: { destination: "/", permanent: false },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductsSlugs();

  return {
    paths: slugs?.map((product) => ({
      params: {
        slug: product.slug,
      },
    })),
    fallback: "blocking",
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 84600, //to revalidate each 24 hours
  };
};
export default ProductPage;
