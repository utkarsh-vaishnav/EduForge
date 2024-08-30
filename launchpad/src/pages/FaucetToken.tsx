import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ethers } from "ethers";

const useStyles = makeStyles(() => ({
  textField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#28b5f6",
      },
    },
  },
  input: {
    color: "#28b5f6",
    fontSize: "12px",
  },
  button: {
    backgroundColor: "#2196f3",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1E3A8A",
    },
  },
}));

const Faucet = () => {
  const classes = useStyles();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [txHash, setTxHash] = useState<string | null>(null); // State to store transaction hash

  const handleRequestTokens = async () => {
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      setSnackbarMessage("Please enter a valid wallet address.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      // We are making this faucet using public key from .env.
      // We can also make this using backend API where we can have certain conditions so user can claim 0.01 EDU tokens/day.
      const provider = new ethers.providers.JsonRpcProvider("https://rpc.open-campus-codex.gelato.digital");

      // Load your wallet using a private key (NOTE: Do not expose private keys in the frontend in production)
      const privateKey :any = process.env.REACT_APP_PRIVATE_KEY; // Replace with your actual private key
      const wallet = new ethers.Wallet(privateKey, provider);

      // Get the current balance of the wallet
      const balance = await wallet.getBalance();
      console.log("Wallet balance:", ethers.utils.formatEther(balance));

      // Check if balance is sufficient
      if (balance.lt(ethers.utils.parseEther("0.01").add(ethers.utils.parseUnits('50', 'gwei').mul(21000)))) {
        throw new Error("Insufficient funds for the transaction including gas fees.");
      }

      // Get the current gas price
      const gasPrice = await provider.getGasPrice();
      console.log("Gas price:", ethers.utils.formatUnits(gasPrice, "gwei"));

      // Get the current nonce for the wallet
      const nonce = await wallet.getTransactionCount();
      console.log("Nonce:", nonce);

      // Estimate the gas limit dynamically
      const estimatedGasLimit = await provider.estimateGas({
        to: walletAddress,
        value: ethers.utils.parseEther("0.01"),
      });

      console.log("Estimated Gas Limit:", estimatedGasLimit.toString());

      // Define transaction parameters
      const tx = {
        to: walletAddress,
        value: ethers.utils.parseEther("0.01"), // Sending 0.01 EDU
        gasLimit: estimatedGasLimit, // Use the dynamically estimated gas limit
        gasPrice: ethers.utils.parseUnits('50', 'gwei'), // Use the fetched gas price
        nonce: nonce,
      };

      console.log("Transaction parameters:", tx);

      // Sign the transaction
      const signedTx = await wallet.signTransaction(tx);
      console.log("Signed transaction:", signedTx);

      // Send the transaction
      const txResponse = await provider.sendTransaction(signedTx);
      console.log("Transaction hash:", txResponse.hash);

      // Set the transaction hash for display
      setTxHash(txResponse.hash);

      // Wait for the transaction to be mined
      await txResponse.wait();

      setSnackbarMessage("Transaction confirmed!");
      setSnackbarSeverity("success");
    } catch (error: any) {
      let errorMessage = "Failed to send transaction.";
      if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
        errorMessage = "Insufficient funds for the transaction.";
      } else if (error.code === ethers.errors.NONCE_EXPIRED) {
        errorMessage = "Nonce is incorrect or expired.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setTxHash(null); // Clear the txHash on error
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 4, width: "100%", maxWidth: 600, mx: "auto" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#000",
          fontSize: "24px",
          lineHeight: "34px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Request <span style={{ fontWeight: 'bold', color: '#2196f3' }}>0.01 EDU</span> Token from the Faucet
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ mt: 2, fontWeight: "900" }}>
              Enter your wallet address
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleRequestTokens}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : null
              }
            >
              {loading ? "Processing..." : "Request Tokens"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000} // Increase duration to give users more time to click the link
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
          {txHash && (
            <Box mt={1}>
              <Typography variant="body2">
                Transaction Hash:{" "}
                <Link
                  href={`https://opencampus-codex.blockscout.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener"
                >
                  {txHash}
                </Link>
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Faucet;
