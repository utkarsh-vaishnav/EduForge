import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Autocomplete,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const useStyles = makeStyles(() => ({
  textField: {
    width: "80%",
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
  dropdownItem: {
    color: "#28b5f6",
    fontSize: "11px",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#c3d1d7",
    },
  },
  selectedItem: {
    backgroundColor: "white",
  },
}));

const DistributeToken = () => {
  const classes = useStyles();
  const [tokensData, setTokensData] = React.useState<any>([]);
  const [data, setData] = React.useState<any[]>([]);
  const [uploadedFileName, setUploadedFileName] = React.useState<string>("");

  const handleFileUpload = (file: File) => {
    const fileType = file.type;
    setUploadedFileName(file.name);

    if (fileType.includes("csv")) {
      Papa.parse(file, {
        header: false,
        complete: (results: any) => {
          const parsedData = results.data.map((row: string[]) => {
            const [address, value] = row[0].split(/\s+/);
            return [address.trim(), parseInt(value.trim())];
          });
          setData(parsedData);
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else if (
      fileType.includes("spreadsheetml") ||
      fileType.includes("excel")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const parsedData = jsonData.map((row: any) => {
          const [address, value] = Object.values(row).join(" ").split(/\s+/);
          return [address.trim(), parseInt(value.trim())];
        });
        setData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType.includes("plain") || fileType.includes("text")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const textData = (e.target?.result as string).trim();
        const parsedData = textData
          .split("\n")
          .map((row) => row.split(/\s+/))
          .map(([address, value]) => [address.trim(), parseInt(value.trim())]);
        setData(parsedData);
      };
      reader.readAsText(file);
    } else {
      console.error("Unsupported file type:", fileType);
    }
  };

  const readTokenData = async () => {
    const data: any = await axios.get(
      `http://localhost:5000/erc20/tokenAndBalance`
    );
    setTokensData(data.data.response);
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => handleFileUpload(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/plain": [".txt"],
    },
  });

  useEffect(() => {
    readTokenData();
  }, []);

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
        MultiSend SepoliaETH or ERC20 Tokens to Multiple Recipients
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              {[
                "Token multiSender dApp for all of your tokens",
                "Send your tokens to multiple recipients efficiently",
                "Send stable coins or cryptocurrency for dividend or coupon payments",
                "Input list of addresses and amounts manually",
                "Distribute automatically via CSV upload",
                "Distribute token product documentation",
              ].map((text, index) => (
                <ListItem key={index} sx={{ py: 0.1 }}>
                  <RadioButtonCheckedIcon
                    sx={{ color: "#28b5f6", marginRight: "10px" }}
                  />
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mt: 4, fontWeight: "900" }}>
                Token contract address *
              </Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={tokensData}
                getOptionLabel={(option: any) => `${option.token_address}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ width: "80%" }}
                    className={classes.textField}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    className={classes.dropdownItem}
                  >
                    <Typography variant="body2" sx={{ display: "flex" }}>
                      <span style={{ fontWeight: "800", flexGrow: 1 }}>
                        {option.symbol}
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {option.token_address}
                      </span>
                    </Typography>
                  </Box>
                )}
              />
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mt: 4, mb: 2, fontWeight: "900" }}
            >
              Addresses with amounts
            </Typography>
            <Box
              {...getRootProps()}
              sx={{
                p: 3,
                mb: 3,
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                border: "2px dashed #07aaf4",
                width: "80%",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <>
                  <CloudUploadIcon
                    color="action"
                    sx={{ fontSize: 40, color: "#07aaf4" }}
                  />
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ color: "#07aaf4" }}
                  >
                    Drag and drop your file here or click to upload
                    <VisuallyHiddenInput
                      type="file"
                      accept=".csv, .xlsx, .xls, .txt"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </Typography>
                  {uploadedFileName ? (
                    <Typography variant="body1" gutterBottom>
                      Uploaded File: {uploadedFileName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      CSV / Excel / Txt
                    </Typography>
                  )}
                </>
              )}
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mt: 4, mb: 2, fontWeight: "900" }}
            >
              Insert manually
            </Typography>
            <TextField
              variant="outlined"
              multiline
              rows={6}
              sx={{ mb: 1, width: "80%",fontSize: "10px" }}
              value={data
                .map((row, index) =>
                  Array.isArray(row)
                    ? index + 1 + ": " + row.join(", ")
                    : index + 1 + ": " + Object.values(row).join(", ")
                )
                .join("\n")}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DistributeToken;
