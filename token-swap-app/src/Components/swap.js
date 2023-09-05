import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';

function TokenSwapPage() {
  const [fromToken, setFromToken] = useState('Marachain');
  const [toToken, setToToken] = useState('Polygon');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [connectedWallet, setConnectedWallet] = useState(null);

  const handleFromTokenChange = (e) => {
    setFromToken(e.target.value);
  };

  const handleToTokenChange = (e) => {
    setToToken(e.target.value);
  };

  const handleFromAmountChange = (e) => {
    setFromAmount(e.target.value);
  };

  

  const handleBridge = async () => {
    // Determine the direction of the bridge based on the selected tokens
    if (fromToken === 'Polygon' && toToken === 'Marachain') {
    
        // Perform the Polygon to Marachain bridge
        fetch('/polygon-to-eth-bridge', {
          method: 'POST', // Change this to POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: fromAmount }),
        });
    
      } else if (fromToken === 'Marachain' && toToken === 'Polygon') {
        // Perform the Marachain to Polygon bridge
        fetch('/eth-to-polygon-bridge', {
          method: 'POST', // Change this to POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: fromAmount }),
        });
    
      
    } else {
      // Handle unsupported bridge direction or show an error message
      console.error('Unsupported bridge direction');
    }
  };

  const connectWallet = async () => {
    try {
      // Request access to the user's accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const selectedAddress = accounts[0];
  
      // Get the current network ID
      const networkId = await window.ethereum.request({ method: 'net_version' });
  
      // Define the network names and RPC URLs
      const networks = {
        '80001': 'Polygon Mumbai Testnet',
        '123456': 'Marachain Testnet',
      };
  
      // Check if the network ID corresponds to Marachain Testnet or Polygon Mumbai Testnet
      if (networks[networkId] === 'Marachain Testnet') {
        // Wallet is connected to Marachain Testnet
        setConnectedWallet(selectedAddress);
        setFromToken('Marachain');
        setToToken('Polygon');
      } else if (networks[networkId] === 'Polygon Mumbai Testnet') {
        // Wallet is connected to Polygon Mumbai Testnet
        setConnectedWallet(selectedAddress);
        setFromToken('Polygon');
        setToToken('Marachain');
      } else {
        // Wallet is connected to an unsupported network
        console.error('Unsupported network');
        // Handle unsupported network or display a message to the user
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Handle errors or display a message to the user
    }
  };
  

  return (
    <Card style={{ width: '400px', height: '500px' }}>
      <CardContent>
        <Typography variant="h4">Token Swap</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <InputLabel>From Token</InputLabel>
            <Select
              value={fromToken}
              onChange={handleFromTokenChange}
              fullWidth
            >
              <MenuItem value="Marachain">Marachain</MenuItem>
              <MenuItem value="Polygon">Polygon</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <InputLabel>To Token</InputLabel>
            <Select value={toToken} onChange={handleToTokenChange} fullWidth>
              <MenuItem value="Marachain">Marachain</MenuItem>
              <MenuItem value="Polygon">Polygon</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount to Swap"
              variant="outlined"
              fullWidth
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
            />
          </Grid>
          <Grid item xs={12}>
            {connectedWallet ? (
              <Typography variant="subtitle1">Connected Wallet: {connectedWallet}</Typography>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBridge}
            >
              Swap
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Receive: {toAmount}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TokenSwapPage;
