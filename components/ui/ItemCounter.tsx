import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography, Chip } from "@mui/material";
import React, { FC, useState } from "react";

interface Props {
  currentValue: number;
  maxValue?: number;
  updateQuantity: (quality: number) => void;
}
export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  updateQuantity,
}) => {
  const [quality, setQuality] = useState<number>(currentValue);
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => {
          setQuality(quality - 1);
          updateQuantity(quality - 1);
        }}
        disabled={currentValue === 1 ? true : false}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 10, textAlign: "center" }}>{quality}</Typography>
      <IconButton
        disabled={currentValue === maxValue ? true : false}
        onClick={() => {
          setQuality(quality + 1);
          updateQuantity(quality + 1);
        }}
      >
        <AddCircleOutline />
      </IconButton>
      {currentValue === maxValue && (
        <Chip
          label="No hay mas productos disponibles"
          color="error"
          className="fadeIn"
        />
      )}
    </Box>
  );
};
