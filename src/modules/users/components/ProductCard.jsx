import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { products } = props;
  const { titulo, precio, imagenes } = products;

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/producto/", { state: { product: products } });
  };

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        <Card style={{ height: "100%" }}>
          <CardActionArea onClick={handleClick}>
            <CardMedia
              component="img"
              height="330"
              image={imagenes[0]}
              alt={titulo}
            ></CardMedia>
            <CardHeader
              title={titulo}
              subheader={precio}
              action={
                <IconButton color="inherit">
                  <AddShoppingCartIcon fontSize="large" />
                </IconButton>
              }
            ></CardHeader>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
};

export default ProductCard;
