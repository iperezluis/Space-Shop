import { Box, CircularProgress, Typography } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
      sx={{ flexDirection: "column" }}
    >
      <Typography sx={{ my: 1 }}>Loading...</Typography>
      <CircularProgress thickness={3} />
    </Box>
  );
};
