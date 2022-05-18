import React from "react";
import { useLocation } from 'react-router-dom'
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";

const ProductDetail = () => {
  const { state } = useLocation() || {};
  const { product } = state || "";
  const { titulo, precio, descripcion, imagenes } = product;

  return (
    <>
      <Box className="" >
        <Card>
          {/* <CardActionArea>
          </CardActionArea> */}
            <CardHeader title={titulo} subheader={precio}></CardHeader>
            <CardContent>
              <p>{descripcion}</p>
            </CardContent>
            <CardMedia
              component="div"
            >
              { imagenes.map((image)=>(
                <img src={image} alt={titulo} height="400">
                </img>
              ))}
            </CardMedia>
        </Card>
      </Box>
    </>
  );
};

export default ProductDetail;
