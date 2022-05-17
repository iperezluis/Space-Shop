import React from "react";

import NextLink from "next/link";
import { Box, Button, Link } from "@mui/material";

import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { CardMedia, Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";

import { AdminLayout } from "../../components/layouts";
import { IProduct } from "../../interfaces/products";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Foto",
    renderCell: ({ row }: GridValueGetterParams) => {
      return [
        <a
          href={`/product/${row.slug}`}
          target="_blank"
          rel="noreferrer"
          key={row.slug}
        >
          <CardMedia component="img" className="fadeIn" image={row.img} />
        </a>,
      ];
    },
  },
  {
    field: "title",
    headerName: "Titulo",
    width: 230,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link>{row.title}</Link>
        </NextLink>
      );
    },
  },
  {
    field: "Gender",
    headerName: "Genero",
  },
  {
    field: "type",
    headerName: "Tipo",
  },
  {
    field: "inStock",
    headerName: "Inventario",
  },
  {
    field: "price",
    headerName: "Precio",
  },
  {
    field: "sizes",
    headerName: "Tallas",
    width: 250,
  },
];
const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) return <></>;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));
  return (
    <AdminLayout
      title={"Productos"}
      subtitle={`Mantenimiento de productos (${data?.length})`}
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear Producto
        </Button>
      </Box>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
