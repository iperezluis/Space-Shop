import { useContext, useState } from "react";

import NextLink from "next/link";

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

import { UIContext } from "../../context/ui";
import { CartContext } from "../../context/cart/CartContext";

export const AdminNavbar = () => {
  const { toggleMenu } = useContext(UIContext);

  const { cart } = useContext(CartContext);
  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Space |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        {/* Flex*/}
        <Box flex={1} />

        <Button onClick={toggleMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
