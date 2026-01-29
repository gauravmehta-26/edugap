import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input Component', () => {
  it('renders with placeholder', () => {
    render(
      <Input
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(
      <Input
        type="text"
        value="test value"
        onChange={() => {}}
      />
    );
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="text"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('renders with label when provided', () => {
    render(
      <Input
        type="email"
        label="Email Address"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('associates label with input using htmlFor', () => {
    render(
      <Input
        type="email"
        label="Email"
        id="email-input"
        value=""
        onChange={() => {}}
      />
    );
    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', 'email-input');
    expect(input).toHaveAttribute('id', 'email-input');
  });
});
