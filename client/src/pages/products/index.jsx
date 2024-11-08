import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { getCryptoData } from "../../api/index";
import "./products.css";

const Product = ({
  id,
  name,
  symbol,
  current_price,
  market_cap,
  circulating_supply,
  total_supply,
  total_volume,
  image
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="product-card">
      <CardContent>
        <Typography variant="h5" component="div">
        <img 
            src={image} 
            alt={`${name} logo`} 
            style={{ width: '30px', height: '30px', marginRight: '10px' }} // Adjust size as needed
          />
          {name} ({symbol.toUpperCase()})
        </Typography>
        <Typography className="product-price">
          NGN{Number(current_price).toFixed(2)}
        </Typography>
        <Rating value={5} readOnly /> {/* Adjust rating as needed */}

        <Typography variant="body2">Current Price: ${Number(current_price).toFixed(2)}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        className="product-collapse"
      >
        <CardContent>
          <Typography>Coin ID: {id}</Typography>
          <Typography>Circulating Supply: {circulating_supply}</Typography>
          <Typography>Total Supply: {total_supply}</Typography>
          <Typography>Total Volume: ${total_volume.toFixed(2)}</Typography>
          {/* Include other stats as necessary */}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    const getAllCrypto = async () => {
      setIsLoading(true);
      try {
        const response = await getCryptoData();
        console.log(response);
        if (response.data.success) {
          setData(response.data.cryptoData.ngnData || []); // Assuming the response contains a 'data' field with the crypto info
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllCrypto();
  }, []);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="products-container">
      <Header title="CRYPTOCURRENCIES" subtitle="See your list of cryptocurrencies." />
      <Box
        className="products-grid"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {data.map(
          ({
            id,
            name,
            symbol,
            current_price,
            market_cap,
            circulating_supply,
            total_supply,
            total_volume,
            image
          }) => (
            <Product
              key={id}
              id={id}
              name={name}
              image={image}
              symbol={symbol}
              current_price={current_price}
              market_cap={market_cap}
              circulating_supply={circulating_supply}
              total_supply={total_supply}
              total_volume={total_volume}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default Products;
