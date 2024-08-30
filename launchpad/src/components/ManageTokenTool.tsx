import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TbHammer } from "react-icons/tb";
import { AiOutlineFire } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaRegPauseCircle } from "react-icons/fa";
import { AiOutlinePercentage } from "react-icons/ai";
import { MdCurrencyExchange } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const ManageTokenTool: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the state passed from the ManageToken component
  const { address, name, symbol, totalSupply, network } = location.state || {};

  // Handle undefined state (e.g., if the page is accessed directly)
  if (!address || !name || !symbol || !totalSupply || !network) {
    navigate("/"); // Redirect to the home page if state is missing
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ p: 4 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center">
              <ArrowBackIcon
                sx={{ mr: 2, cursor: "pointer" }}
                onClick={() => navigate(-1)}
              />
              <Typography variant="h4">Manage Token</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" color="textSecondary">
            {address}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Box display="flex" alignItems="center">
            <Typography variant="h5" component="div" sx={{ mr: 2 }}>
              {name} ({symbol})
            </Typography>
            <Chip
              icon={<VerifiedIcon />}
              label="Automatic Verification"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Token name:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Token supply:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {totalSupply}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <TbHammer /> Mint
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <AiOutlineFire /> Burn
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <CgProfile /> Change owner
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <FaHandHoldingUsd /> Renounce ownership
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <FaRegPauseCircle />
                Pause
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <AiOutlinePercentage />
                Edit transaction tax / fee
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="manageTokenButton"
              >
                <MdCurrencyExchange />
                Change tokens per address limit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ManageTokenTool;
