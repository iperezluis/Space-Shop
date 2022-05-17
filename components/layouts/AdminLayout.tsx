import React, { FC } from "react";
import { Navbar, SideBar } from "../ui";

import { AdminNavbar } from "../admin";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
}
export const AdminLayout: FC<Props> = ({ title, subtitle, icon, children }) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>
      <SideBar />
      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};
