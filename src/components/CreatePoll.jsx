import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

function CreatePoll({ onCreatePoll }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (options.length < 5) { // Limit to 5 options
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.trim() && options.every(o => o.trim())) {
      onCreatePoll({ question, options });
      setQuestion('');
      setOptions(['', '']);
    }
  };

  return (
    <Box sx={{ p: 2, background: '#3c3c3c', borderRadius: '16px' }}>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
        Create a Poll
      </Typography>
      <TextField
        fullWidth
        label="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
      />
      {options.map((option, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          variant="outlined"
          margin="dense"
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
      ))}
      <Button onClick={handleAddOption} sx={{ mt: 1 }}>Add Option</Button>
      <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }}>
        Start Poll
      </Button>
    </Box>
  );
}

export default CreatePoll;
