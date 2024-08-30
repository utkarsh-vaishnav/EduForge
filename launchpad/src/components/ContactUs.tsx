import React from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';

const ContactUs: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" gutterBottom>
          We would love to hear from you. Please fill out the form below, and we'll get back to you as soon as possible.
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="name"
                label="Name"
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="subject"
                label="Subject"
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="message"
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth>
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default ContactUs;
