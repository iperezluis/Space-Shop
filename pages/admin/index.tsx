import {
  AccessTimeFilledOutlined,
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";
import { Analytics } from "../../interfaces";

interface Props {}
const DashBoardPage: NextPage<Props> = () => {
  const { data, error } = useSWR<Analytics>("/api/admin/Dashboard", {
    refreshInterval: 30 * 1000, // 30sg
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    let interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data && !error) {
    return <></>;
  }
  if (error) {
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>;
  }
  const dataIuser = [];
  const {
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
    numberOfClients,
    numberOfOrders,
    paidOrders,
    notPaidOrders,
  } = data!;

  return (
    <AdminLayout
      title={"DashBoard"}
      subtitle={"Estadisticas"}
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle="Ordenes totales"
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTile
          title={paidOrders}
          subtitle="Ordenes pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subtitle="Ordenes pendientes"
          icon={<AttachMoneyOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subtitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subtitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productsWithNotInventory}
          subtitle="Sin existencia"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTile
          title={lowInventory}
          subtitle="Bajo inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTile
          title={refreshIn}
          subtitle="Actualizacion en:"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
