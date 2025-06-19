import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RateModal = ({ show, onClose, onApply, joblist }) => {
    console.log('joblist: ', joblist);
    const [rateType, setRateType] = useState('percent');
    const [value, setValue] = useState('');
  
    useEffect(() => {
      setRateType(joblist[0]?.salePriceType ?? 'percent');
      setValue(joblist[0]?.SalePriceDiscount ?? '');
    }, [joblist]);

  const handleCheckboxChange = (type) => {
    setRateType((prev) => (prev === type ? '' : type));
  };

  const handleApply = () => {
    if (!rateType || value === '') {
      alert('Please select a rate type and enter a value.');
      return;
    }

    onApply({ type: rateType, value });
    handleClose();
  };

  const handleClose = () => {
    setRateType('');
    setValue('');
    onClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
        Set Rate Per Piece
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rateType === 'percent'}
                  onChange={() => handleCheckboxChange('percent')}
                />
              }
              label="Percent per pcs"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rateType === 'amount'}
                  onChange={() => handleCheckboxChange('amount')}
                />
              }
              label="Amount per pcs"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="success" onClick={handleApply}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateModal;
