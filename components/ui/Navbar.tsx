import { useContext, useState } from "react";

import { useRouter } from "next/router";
import NextLink from "next/link";

import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
  Input,
  InputAdornment,
} from "@mui/material";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  ClearOutlined,
} from "@mui/icons-material";
import { UIContext } from "../../context/ui";
import { CartContext } from "../../context/cart/CartContext";

export const Navbar = () => {
  const [Term, setTerm] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const { orderSummary } = useContext(CartContext);
  const { numberOfItems } = orderSummary;

  const { asPath, push } = useRouter();
  const { toggleMenu } = useContext(UIContext);
  // console.log({ asPath });
  const onToggle = () => {
    toggleMenu();
  };
  const onSearchTerm = () => {
    if (Term.trim().length === 0) return null;
    push(`/Search/${Term}`);
    setTerm("");
    setIsSearchVisible(false);
  };
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
        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={asPath === "/category/men" ? "primary" : "info"}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={asPath === "/category/women" ? "primary" : "info"}>
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button color={asPath === "/category/kid" ? "primary" : "info"}>
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />
        {isSearchVisible ? (
          <Input
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
            className="fadeIn"
            autoFocus
            value={Term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <SearchOutlined />
          </IconButton>
        )}

        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={toggleMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={onToggle}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
