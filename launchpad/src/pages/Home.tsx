import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import ethereum from "../assets/ethereum.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box className="home-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            Easily create your Token
          </Typography>
          <Typography variant="h6" gutterBottom>
            Create and manage your token, automate payments and track your token
            portfolio effortlessly – Token Launchpad by <span style={{color: "#cc0000"}}>EduForge</span> is the leading
            token maker DApp.
          </Typography>
          <Button component={Link}
            to="/createToken" variant="contained" color="primary" sx={{ mt: 3 }}>
            Start by creating a token
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "auto",
            }}
          >
            <Box className="crypto-animation-container">
              <img
                src={ethereum}
                alt="Ethereum"
                className="crypto-image floating"
                
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
    // <Box className="home-container">

    // </Box>
  );
};

export default Home;
