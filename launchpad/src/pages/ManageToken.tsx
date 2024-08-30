import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import TokenABI from "../utils/myToken.json"; // Import ERC20 ABI
const ERC20ABI = TokenABI.abi;


// Define the supported networks
const NETWORKS = {
  Sepolia: {
    name: "Sepolia",
    chainId: 11155111,
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  BSC: {
    name: "BSC",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  Polygon: {
    name: "Polygon",
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  },
  OpenCampus: {
    name: "OpenCampusCodex",
    chainId: 656476,
    rpcUrl: "https://rpc.open-campus-codex.gelato.digital",
  },
};

const ManageToken: React.FC = () => {
  const [contractAddress, setContractAddress] = useState<string>(""); // State for the contract address
  const [error, setError] = useState<string>(""); // State for error handling
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>("Sepolia"); // Default to Sepolia
  const navigate = useNavigate();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value); // Update contract address as user types
  };

  const handleNetworkChange = (event: SelectChangeEvent) => {
    setSelectedNetwork(event.target.value as keyof typeof NETWORKS);
  };

  const handleManageClick = async () => {
    if (!ethers.utils.isAddress(contractAddress)) {
      setError("Invalid contract address");
      return;
    }

    try {
      setError(""); // Clear any previous error
      const networkConfig = NETWORKS[selectedNetwork];
      const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl);

      const contract = new ethers.Contract(contractAddress, ERC20ABI, provider);

      // Fetch token data (name, symbol, total supply, etc.)
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();

      // Navigate to another page with the fetched data
      navigate("/manageTokenTool", {
        state: {
          address: contractAddress,
          name,
          symbol,
          totalSupply: ethers.utils.formatUnits(totalSupply, 18), // Assuming 18 decimals
          network: selectedNetwork,
        },
      });
    } catch (error) {
      setError("Failed to fetch token data. Make sure the contract is a valid ERC20 token.");
      console.error(error);
    }
  };

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
        Manage your Tokens
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              {[
                "Create liquidity pool",
                "Mint additional tokens, burn tokens",
                "Change token owner or renounce ownership",
                "Pause and unpause, manage whitelist and blacklist",
                "Works with all tokens that were created with Token Tool",
                "Manage token product documentation",
              ].map((text, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <RadioButtonCheckedIcon sx={{ color: "#1E3A8A", marginRight: "20px" }} />
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="network-select-label">Select Network</InputLabel>
                <Select
                  labelId="network-select-label"
                  value={selectedNetwork}
                  onChange={handleNetworkChange}
                >
                  {Object.keys(NETWORKS).map((networkKey) => (
                    <MenuItem key={networkKey} value={networkKey}>
                      {NETWORKS[networkKey as keyof typeof NETWORKS].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Token contract address *</Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="0xfb2aff6bf2d339a5e73ed73f1ec554b6ee3de356"
                sx={{ width: "80%" }}
                value={contractAddress}
                onChange={handleAddressChange} // Handle address input change
              />
            </Box>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleManageClick}>
                Continue
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography>
                Don’t have your own token yet?{" "}
                <Link to="/createToken" style={{ color: "#28b5f6", textDecoration: "none", fontWeight: "bold" }}>
                  Create Token
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManageToken;
