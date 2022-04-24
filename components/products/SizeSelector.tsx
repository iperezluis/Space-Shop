import React, { EventHandler, FC, MouseEvent } from "react";

import { ISize } from "../../interfaces";
import { Box, Button } from "@mui/material";

interface Props {
  selectedSize: ISize | undefined;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}
export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSelectedSize,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() => onSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
