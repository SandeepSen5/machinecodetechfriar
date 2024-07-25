import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const MAX = 500000;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

export default function CustomMarks({ priceRange, setPriceRange }) {
  const handleChange = (_, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Slider
        marks={marks}
        step={10}
        value={priceRange}
        valueLabelDisplay="auto"
        min={MIN}
        max={MAX}
        onChange={handleChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          onClick={() => setPriceRange([MIN, MIN])}
          sx={{ cursor: 'pointer' }}
        >
          {MIN} min
        </Typography>
        <Typography
          variant="body2"
          onClick={() => setPriceRange([MAX, MAX])}
          sx={{ cursor: 'pointer' }}
        >
          {MAX} max
        </Typography>
      </Box>
    </Box>
  );
}
