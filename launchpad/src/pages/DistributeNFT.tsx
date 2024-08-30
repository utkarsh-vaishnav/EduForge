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

const DistributeNFT = () => {
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
        
NFT Multisender
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              {[
                "Works with all NFTs that were created with Token Tool",
                "Multisend NFTs to many recipients",
                "Send NFTs on both ERC721 and ERC1155 token standards",
                "Input list of addresses and amounts manually",
                "Distribute automatically via CSV upload",
                "Distribute NFT product documentation",
              ].map((text, index) => (
                <ListItem key={index} sx={{ py: 0.1 }}>
                  <RadioButtonCheckedIcon sx={{ color: "#1E3A8A",marginRight: "10px"  }} />
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Token contract address *</Typography>
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default DistributeNFT