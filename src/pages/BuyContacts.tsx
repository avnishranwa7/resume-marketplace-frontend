import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const PRICE_PER_CONTACT = 49;

const BuyContacts: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) ? 0 : val);
    setTouched(true);
  };

  const total = quantity > 0 ? quantity * PRICE_PER_CONTACT : 0;
  const isValid = quantity > 0 && Number.isInteger(quantity);

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f7fa">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 400 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Buy Profile Contacts
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3} align="center">
          Each contact unlock allows you to view the email and phone number of one candidate profile.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary" mb={1} align="center" sx={{mb: 3}}>
          1 profile contact costs <span style={{ color: '#4361EE', fontWeight: 600 }}>₹49</span>
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Number of Contacts"
            type="number"
            value={quantity}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            inputProps={{ min: 1, step: 1 }}
            error={touched && (!isValid)}
            helperText={touched && (!isValid) ? 'Please enter a valid number (min 1)' : ' '}
            fullWidth
          />
          <Typography variant="subtitle1" fontWeight={500} align="center" sx={{ mt: -4 }}>
            Total: <span style={{ color: '#4361EE', fontWeight: 700, fontSize: '1.2em' }}>₹{total}</span>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!isValid}
            sx={{ mt: 1, backgroundColor: '#4361EE', fontWeight: 600, borderRadius: 2 }}
          >
            Proceed to Payment
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box display="flex" alignItems="flex-start" gap={1}>
          <InfoIcon color="info" sx={{ mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">
            You can use purchased contacts at any time. Each unlock gives you access to one candidate's contact details. No subscription required.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BuyContacts; 