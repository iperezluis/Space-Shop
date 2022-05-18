import React, { useContext, useState } from "react";
import {
  SearchOutlined,
  AccountCircleOutlined,
  ConfirmationNumberOutlined,
  MaleOutlined,
  FemaleOutlined,
  EscalatorWarningOutlined,
  VpnKeyOutlined,
  LoginOutlined,
  CategoryOutlined,
  AdminPanelSettings,
  DashboardOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { UIContext } from "../../context/ui";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";

export const SideBar = () => {
  const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
  const { isMenuOpen, toggleMenu } = useContext(UIContext);
  const [Term, setTerm] = useState<string>("");
  const router = useRouter();

  const navigateTo = (url: string) => {
    toggleMenu();
    router.push(`${url}`);
  };
  const onToggle = () => {
    toggleMenu();
  };
  const onSearchTerm = () => {
    if (Term.trim().length === 0) return null;
    navigateTo(`/Search/${Term}`);
    setTerm("");
    toggleMenu();
  };
  return (
    <Drawer
      open={isMenuOpen}
      onBackdropClick={onToggle}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              value={Term}
              onChange={(e) => setTerm(e.target.value)}
              type="text"
              onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>
          {isLoggedIn && user?.role === "client" ? (
            <>
              <ListItem button onCLick={() => {}}>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItem>

              <ListItem button onCLick={() => navigateTo("/orders/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/men")}
              >
                <ListItemIcon>
                  <MaleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Hombres"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/women")}
              >
                <ListItemIcon>
                  <FemaleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mujeres"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/kid")}
              >
                <ListItemIcon>
                  <EscalatorWarningOutlined />
                </ListItemIcon>
                <ListItemText primary={"Niños"} />
              </ListItem>

              <ListItem button onClick={logoutUser}>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary={"Salir"} />
              </ListItem>
            </>
          ) : isLoggedIn && user?.role === "admin" ? (
            <>
              <ListItem button onClick={() => {}}>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo("/orders/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/men")}
              >
                <ListItemIcon>
                  <MaleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Hombres"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/women")}
              >
                <ListItemIcon>
                  <FemaleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mujeres"} />
              </ListItem>

              <ListItem
                button
                sx={{ display: { xs: "", sm: "none" } }}
                onClick={() => navigateTo("/category/kid")}
              >
                <ListItemIcon>
                  <EscalatorWarningOutlined />
                </ListItemIcon>
                <ListItemText primary={"Niños"} />
              </ListItem>

              <ListItem button onClick={logoutUser}>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary={"Salir"} />
              </ListItem>

              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button onClick={() => navigateTo("/admin/")}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>
              <ListItem button onClick={() => navigateTo("/admin/products")}>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={"Productos"} />
              </ListItem>
              <ListItem button onClick={() => navigateTo("/orders/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Ordenes"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo("/admin/users")}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Usuarios"} />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
            >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItem>
          )}

          {/* Admin */}
        </List>
      </Box>
    </Drawer>
  );
};
