import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Link } from "react-router-dom";

const ManageNFT = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#000",
          fontSize: "24px",
          lineHeight: "34px",
          marginBottom: "20px",
        }}
      >
        Manage your NFTs
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              {[
                "Review NFT configuration",
                "Add metadata",
                "Prepare NFT batch minting",
                "Add and remove addresses to the minter whitelist",
                "Works with all NFTs that were created with Token Tool",
                "Manage NFT product documentation",
              ].map((text, index) => (
                <ListItem key={index} sx={{ py: 0.1 }}>
                  <RadioButtonCheckedIcon
                    sx={{ color: "#1E3A8A", marginRight: "10px" }}
                  />
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">NFT contract address*</Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Enter NFT address"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Continue
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography>
                Don’t have your own NFT yet?{" "}
                <Link
                  to="/createToken"
                  style={{
                    color: "#28b5f6",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Create NFT
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManageNFT;
