import { PeopleOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import { spaceApi } from "../../api";
import axios from "axios";

const UsuariosPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdate = (userId: string, newRole: string) => {
    //enviamos el prevoiusUser al catch en caso de que algo salga mal
    const previousUsers = users.map((user) => ({ ...user }));
    //mapeamos y cambiamos solo el rol del user que coincida con el id que enviamos
    const updateUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updateUsers);
    try {
      const res = spaceApi.put("/admin/users", { id: userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      if (axios.isAxiosError(error)) {
        return alert(error);
      }
      return console.log(error);
    }
  };
  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "correo",
      width: 250,
    },
    {
      field: "name",
      headerName: "Nombre Completo",
      width: 250,
    },
    {
      field: "role",
      headerName: "Role",
      width: 250,
      renderCell: ({ row }: GridValueGetterParams) => (
        <Select
          value={row.role}
          label="Rol"
          sx={{ width: "300px" }}
          onChange={(e) => onRoleUpdate(row.id, e.target.value)}
        >
          <MenuItem value="admin">admin</MenuItem>
          <MenuItem value="client">client</MenuItem>
          <MenuItem value="super-user">Super User</MenuItem>
          <MenuItem value="SEO">SEO</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <AdminLayout
      title={"Usuarios"}
      subtitle={"Mantenimiento de usuarios"}
      icon={<PeopleOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[0]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsuariosPage;
