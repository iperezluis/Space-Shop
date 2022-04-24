import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Link,
  Typography,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import React, { FC, useMemo, useState } from "react";
import { IProduct } from "../../interfaces";

import styles from "./ProductStylesCard.module.css";

interface Props {
  product: IProduct;
  inOffert?: boolean;
}
export const ProductCard: FC<Props> = ({ product, inOffert }) => {
  const [isHovered, setIsHovered] = useState<boolean>();
  const [isLoadedImage, setIsLoadedImage] = useState<boolean>(false);
  //effect of hoover when we touch the image with mouse
  const productImage = useMemo(() => {
    return isHovered
      ? `/products/${product.images[1]}`
      : `/products/${product.images[0]}`;
  }, [isHovered, product.images]);
  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  className={styles["each-tag"]}
                  label="No hay disponible"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: "10px",
                    left: "10px",
                  }}
                />
              )}
              {inOffert && product.inStock > 0 && (
                <Chip
                  className={styles["each-tag-offert"]}
                  label="¡En oferta!"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: "10px",
                    left: "10px",
                  }}
                />
              )}
              <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                className="fadeIn"
                onLoad={() => setIsLoadedImage(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isLoadedImage ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{"$" + product.price}</Typography>
      </Box>
    </Grid>
  );
};
