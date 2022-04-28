import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";

const ProductCard = (props) => {
  const { products } = props;
  const { titulo, precio, descripcion, imagenes } = products;

  return (
    <>
      <Box className="" maxWidth="sm">
        <Card>
          <CardActionArea>
            <CardHeader title={titulo} subheader={precio}>
            </CardHeader>
            <CardMedia
              component="img"
              height="140"
              image={imagenes[0]}
              alt={titulo}
            ></CardMedia>
            <CardContent>
              <p>{descripcion}</p>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
};

export default ProductCard;
