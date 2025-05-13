import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";

import { useMakePayment } from "../queries/payment";
import axiosInstance from "../api/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useAppSelector from "../hooks/useAppSelector";

const PRICE_PER_CONTACT = 49;

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

async function displayRazorpay(
  amount: number,
  currency: string,
  orderId: string,
  userId: string | null,
  navigate: () => void,
  onCancel: () => void
) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_ID,
    amount: amount.toString(),
    currency,
    name: "Resume Marketplace",
    order_id: orderId,
    modal: {
      ondismiss: async () => {
        try {
          await axiosInstance.post("/cancel-payment", {
            userId,
          });
          onCancel();
        } catch (err) {
          console.log(err);
        }
      },
    },
    handler: async function (response: any) {
      const res = await axiosInstance.post("/verify-payment", {
        orderId,
        userId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
      if (res.status === 200) {
        navigate();
      } else {
        // fail
        console.log("fail");
      }
    },
    theme: {
      color: "#61dafb",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

const BuyContacts: React.FC = () => {
  useDocumentTitle("Buy Contact Access");
  const auth = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const client = useQueryClient();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [touched, setTouched] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });

  const { mutate: pay, isPending: paying } = useMakePayment((data) => {
    if (!data) return;
    displayRazorpay(
      data.amount,
      data.currency,
      data.id,
      auth.userId,
      () => {
        client.invalidateQueries({
          queryKey: ["available-contacts", auth.userId],
        });
        if (location.state?.id) {
          navigate(`/profile/${location.state.id}`, { replace: true });
        } else {
          setSnackbar({
            open: true,
            message: "Thank you for your purchasing profile contact(s)",
            severity: "success",
          });
        }
      },
      () => {
        setSnackbar({
          open: true,
          message: "Payment failed! Unable to buy profile contacts",
          severity: "error",
        });
      }
    );
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) ? 0 : val);
    setTouched(true);
  };

  const total = quantity > 0 ? quantity * PRICE_PER_CONTACT : 0;
  const isValid = quantity > 0 && Number.isInteger(quantity);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f7fa"
    >
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 400 }}
      >
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Buy Profile Contacts
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={3}
          align="center"
        >
          Each contact unlock allows you to view the email and phone number of
          one candidate profile.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          mb={1}
          align="center"
          sx={{ mb: 3 }}
        >
          1 profile contact costs{" "}
          <span style={{ color: "#4361EE", fontWeight: 600 }}>₹49</span>
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Number of Contacts"
            type="number"
            value={quantity}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            inputProps={{ min: 1, step: 1 }}
            sx={{ mb: 2 }}
            error={touched && !isValid}
            helperText={
              touched && !isValid ? "Please enter a valid number (min 1)" : " "
            }
            fullWidth
          />
          <Typography
            variant="subtitle1"
            fontWeight={500}
            align="center"
            sx={{ mt: -4 }}
          >
            Total:{" "}
            <span
              style={{ color: "#4361EE", fontWeight: 700, fontSize: "1.2em" }}
            >
              ₹{total}
            </span>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            loading={paying}
            disabled={!isValid}
            onClick={() => {
              pay({ amount: total, contactCount: quantity });
            }}
            sx={{
              mt: 1,
              backgroundColor: "#4361EE",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box display="flex" alignItems="flex-start" gap={1}>
          <InfoIcon color="info" sx={{ mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">
            You can use purchased contacts at any time. Each unlock gives you
            access to one candidate's contact details. No subscription required.
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BuyContacts;
