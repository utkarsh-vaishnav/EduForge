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
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import MyToken from "../utils/myToken.json";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const CreateToken = () => {
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    decimal: "",
    totalSupply: "",
    network: "",
    canBurn: false,
    canMint: false,
    setTotalSupplyCap: false,
    maxTokensPerAddressLimited: false,
    chargeTransactionFee: false,
    _burnFee: "0",
    _totalSupplyCap: "0",
    _maxTokensPerAddress: "0",
    _transactionFee: "0",
  });

  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const explorers = {
    Ethereum: "https://sepolia.etherscan.io/address/",
    Polygon: "https://mumbai.polygonscan.com/address/",
    BNB: "https://testnet.bscscan.com/address/",
    OpenCampusCodex: "https://opencampus-codex.blockscout.com/address/",
  };

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
        const settingsToSend = {
          canBurn: formData.canBurn,
          canMint: formData.canMint,
          setTotalSupplyCap: formData.setTotalSupplyCap,
          maxTokensPerAddressLimited: formData.maxTokensPerAddressLimited,
          chargeTransactionFee: formData.chargeTransactionFee,
          burnFee: ethers.utils.parseUnits(formData._burnFee, formData.decimal),
          totalSupplyCap: ethers.utils.parseUnits(
            formData._totalSupplyCap,
            formData.decimal
          ),
          maxTokensPerAddress: ethers.utils.parseUnits(
            formData._maxTokensPerAddress,
            formData.decimal
          ),
          transactionFee: ethers.utils.parseUnits(
            formData._transactionFee,
            formData.decimal
          ),
        };
        const contract = await factory.deploy(
          formData.tokenName,
          formData.tokenSymbol,
          ethers.utils.parseUnits(formData.totalSupply, formData.decimal),
          parseInt(formData.decimal),
          settingsToSend
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
          Create ERC20 Token on EVM based chain
        </Typography>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                {[
                  "Simple, fast and convenient token generator",
                  "No smart contract programming required",
                  "Get 100% ownership of generated tokens",
                  "Set custom token name, symbol and initial supply",
                  "Sign and create with your own wallet",
                  "Create token product documentation",
                ].map((text, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <RadioButtonCheckedIcon sx={{ color: "#1E3A8A", marginRight: "20px" }} />
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
                    backgroundColor: "#dadde3",
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
                    Create ERC20 Token
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
                      <TextField
                        required
                        fullWidth
                        name="decimal"
                        label="Decimal"
                        type="number"
                        id="decimal"
                        autoComplete="decimal"
                        value={formData.decimal}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="totalSupply"
                        label="Total Supply"
                        id="totalSupply"
                        autoComplete="totalSupply"
                        value={formData.totalSupply}
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
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          mb: 1,
                          color: "#283240",
                          fontWeight: "900",
                          fontSize: "19px",
                        }}
                      >
                        Token configuration
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.canBurn}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                canBurn: !formData.canBurn,
                              })
                            }
                          />
                        }
                        label="Can Burn"
                      />
                    </Grid>
                    {formData.canBurn && (
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            mb: 1,
                            color: "#283240",
                            fontWeight: "900",
                            fontSize: "12px",
                          }}
                        >
                          Burn fee on transfer Token
                        </Typography>
                        <TextField
                          required
                          fullWidth
                          id="_burnFee"
                          label="Burn Fee"
                          name="_burnFee"
                          autoComplete="_burnFee"
                          value={formData._burnFee}
                          onChange={handleChange}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.canMint}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                canMint: !formData.canMint,
                              })
                            }
                          />
                        }
                        label="Can Mint"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.setTotalSupplyCap}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                setTotalSupplyCap: !formData.setTotalSupplyCap,
                              })
                            }
                          />
                        }
                        label="Set Total Supply Cap"
                      />
                    </Grid>
                    {formData.setTotalSupplyCap && (
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            mb: 1,
                            color: "#283240",
                            fontWeight: "900",
                            fontSize: "12px",
                          }}
                        >
                          Maximum supply of tokens that can be minted
                        </Typography>
                        <TextField
                          required
                          fullWidth
                          id="_totalSupplyCap"
                          label="Total Supply Cap"
                          name="_totalSupplyCap"
                          autoComplete="_totalSupplyCap"
                          value={formData._totalSupplyCap}
                          onChange={handleChange}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.chargeTransactionFee}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                chargeTransactionFee:
                                  !formData.chargeTransactionFee,
                              })
                            }
                          />
                        }
                        label="Charge TransactionFee"
                      />
                    </Grid>
                    {formData.chargeTransactionFee && (
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            mb: 1,
                            color: "#283240",
                            fontWeight: "900",
                            fontSize: "12px",
                          }}
                        >
                          Tax / fee on transfer Token
                        </Typography>
                        <TextField
                          required
                          fullWidth
                          id="_transactionFee"
                          label="Transaction Fee"
                          name="_transactionFee"
                          autoComplete="_transactionFee"
                          value={formData._transactionFee}
                          onChange={handleChange}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.maxTokensPerAddressLimited}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                maxTokensPerAddressLimited:
                                  !formData.maxTokensPerAddressLimited,
                              })
                            }
                          />
                        }
                        label="Max number of tokens per address is limited"
                      />
                    </Grid>
                    {formData.maxTokensPerAddressLimited && (
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="_maxTokensPerAddress"
                          label="Max number of tokens per address"
                          name="_maxTokensPerAddress"
                          autoComplete="_maxTokensPerAddress"
                          value={formData._maxTokensPerAddress}
                          onChange={handleChange}
                        />
                      </Grid>
                    )}
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
                      <Typography>
                        View on Explorer:{" "}
                        <Link
                          href={`${explorers[formData.network as keyof typeof explorers]}${contractAddress}`}
                          target="_blank"
                          rel="noopener"
                        >
                          {contractAddress}
                        </Link>
                      </Typography>
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

export default CreateToken;
