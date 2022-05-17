import React, { useContext, FC } from "react";
import NextLink from "next/link";

import {
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
  Box,
  Button,
} from "@mui/material";

import { CartContext } from "../../context";
import { IOrderItem, IProductCart } from "../../interfaces";
import { ItemCounter } from "../ui";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CartList: FC<Props> = ({ editable, products }) => {
  const { cart, updateProductInCart, removeProductInCart } =
    useContext(CartContext);

  const onChangeQuantity = (product: IProductCart, newQuantity: number) => {
    product.quantity = newQuantity;
    updateProductInCart(product);
  };
  const removeProductCart = (product: IProductCart) => {
    removeProductInCart(product);
  };
  //if orderItems exist we use products otherwise we use cart
  const productToShow = products ? products : cart;
  return (
    <>
      {productToShow.map((product) => (
        <Grid container spacing={2} key={product.slug + product.sizes}>
          {/* TODO llevar  ala pagina del product */}
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.sizes}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  updateQuantity={(value) =>
                    onChangeQuantity(product as IProductCart, value)
                  }
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity}{" "}
                  {product.quantity > 1 ? "productos" : "producto"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">{"$" + product.price}</Typography>
            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeProductCart(product as IProductCart)}
              >
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
