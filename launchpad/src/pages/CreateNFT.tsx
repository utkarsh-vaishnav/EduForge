import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import MyToken from "../utils/myToken721.json";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const CreateNFT = () => {
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    network: "",
  });

  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isConnected && walletProvider) {
        const selectedNetworkId =
        formData.network === "Ethereum"
          ? 11155111
          : formData.network === "Polygon"
          ? 80002
          : formData.network === "BNB"
          ? 97
          : formData.network === "OpenCampusCodex"
          ? 656476 
          : null;
        if (chainId !== selectedNetworkId) {
          setError(
            `Please switch to the ${formData.network} network in your wallet`
          );
          setLoading(false);
          return;
        }
        const ethersProvider = new ethers.providers.Web3Provider(
          walletProvider
        );
        const signer = await ethersProvider.getSigner();
        const factory = new ethers.ContractFactory(
          MyToken.abi,
          MyToken.bytecode,
          signer
        );
        const contract = await factory.deploy(
          formData.tokenName,
          formData.tokenSymbol
        );

        await contract.deployed();
        setContractAddress(contract.address);
      } else {
        setError("Ethereum wallet is not detected");
      }
    } catch (err: any) {
      setError(`Deployment failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
          Create NFT Smart Contract on EVM based chain
        </Typography>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                {[
                  "Simple, fast and convenient NFT generator",
                  "No smart contract programming required",
                  "Get 100% ownership of generated tokens",
                  "Allow NFT buyers to mint your NFTs",
                  "Sign and create with your own wallet",
                  "Create NFT product documentation",
                ].map((text, index) => (
                  <ListItem key={index} sx={{ py: 0.2 }}>
                    <RadioButtonCheckedIcon
                      sx={{ color: "#1E3A8A", marginRight: "10px" }}
                    />
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
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
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: "500px",
                    margin: "auto",
                    mt: 5,
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      mb: 4,
                      fontWeight: "900",
                      color: "#283240",
                    }}
                  >
                    Create ERC721 Token
                    <Typography
                      component="h1"
                      variant="h5"
                      sx={{
                        borderBottom: "1px solid #283240",
                        width: "250px",
                        margin: "auto",
                        mt: 1,
                      }}
                    ></Typography>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="tokenName"
                        label="Token Name"
                        name="tokenName"
                        autoComplete="tokenName"
                        value={formData.tokenName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="tokenSymbol"
                        label="Token Symbol"
                        name="tokenSymbol"
                        autoComplete="tokenSymbol"
                        value={formData.tokenSymbol}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="network-label">Network</InputLabel>
                        <Select
                          labelId="network-label"
                          id="network"
                          name="network"
                          value={formData.network}
                          onChange={handleSelectChange}
                          label="Network"
                        >
                          <MenuItem value="Ethereum">Ethereum</MenuItem>
                          <MenuItem value="Polygon">Polygon</MenuItem>
                          <MenuItem value="BNB">BNB</MenuItem>
                          <MenuItem value="OpenCampusCodex">Open Campus Codex</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: "#283240",
                    }}
                  >
                    {loading ? "Deploying..." : "Deploy Contract"}
                  </Button>
                  {contractAddress && (
                    <div>
                      <h2>Contract Deployed!</h2>
                      <p>Address: {contractAddress}</p>
                    </div>
                  )}
                  {error && (
                    <div>
                      <p style={{ color: "red" }}>{error}</p>
                    </div>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CreateNFT;
