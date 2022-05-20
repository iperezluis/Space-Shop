import React, { ChangeEvent, FC, useRef, useState } from "react";
import { GetServerSideProps } from "next";

import { dbUsers } from "../../database";

import { ShopLayout } from "../../components/layouts";
import { getSession } from "next-auth/react";
import { IUser } from "../../interfaces";
import {
  Grid,
  Box,
  Typography,
  CardMedia,
  CardActions,
  Button,
  Card,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { AccountCircle, SaveOutlined } from "@mui/icons-material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { spaceApi } from "../../api";

interface Props {
  user: IUser;
}
const ProfilePage: FC<Props> = ({ user }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onFilesChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await spaceApi.post<{ message: string }>(
          "/admin/upload",
          formData
        );
        setImage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveChanges = async () => {
    if (image.length === 0) {
      return;
    }
    setIsSaving(true);

    try {
      const { data } = await spaceApi({
        url: "/user/update",
        method: "POST",
        data: { image: image, id: user._id },
      });
      setIsSaving(false);
      console.log({ data });
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };
  return (
    <ShopLayout title={"SpaceShop-profile"} pageDescription={"Mi perfil"}>
      <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
        <Button
          color="secondary"
          startIcon={<SaveOutlined />}
          sx={{ width: "150px" }}
          type="submit"
          disabled={isSaving || image.length === 0}
          onClick={() => saveChanges()}
        >
          Guardar
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          sx={{ height: { xs: "", sm: 200 } }}
        >
          <Card>
            <CardMedia
              component="img"
              className="fadeIn"
              image={
                user.image
                  ? user.image
                  : image
                  ? image
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
              }
              sx={{
                borderRadius: "100%",
                height: { xs: 330, sm: 340, md: 390 },
                width: { xs: "100%", sm: "100%", md: "80%" },
                marginLeft: { md: 5 },
              }}
              alt={user.image}
            />
            <CardActions>
              <Button
                fullWidth
                color="primary"
                onClick={() => inputFileRef.current?.click()}
                startIcon={<AddAPhotoIcon />}
              >
                {user.image ? "Actualizar" : "Agregar"}
              </Button>
              <input
                ref={inputFileRef}
                type="file"
                accept="image/png, image/gif, image/jpeg, image/jpg"
                style={{ display: "none" }}
                onChange={(e) => onFilesChange(e)}
              />
              <Button
                fullWidth
                color="primary"
                onClick={() => {}}
                disabled={user.image ? false : true}
              >
                Eliminar
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={8} xl={8}>
          <Box display="flex" flexDirection="column" sx={{ mt: 1 }}>
            {/* titles */}
            <Typography variant="h1" component="h1">
              Informacion del usuario:
            </Typography>
            <Divider />
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" component="h2" sx={{ mb: 1 }}>
                <AccountCircle /> {user.name}
              </Typography>
              <Typography variant="subtitle1" component="h2">
                <EmailIcon /> {user.email}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/profile",
        permanent: false,
      },
    };
  }
  const user = await dbUsers.getUserById(session.user._id);

  console.log(user);
  return {
    props: { user },
  };
};

export default ProfilePage;
