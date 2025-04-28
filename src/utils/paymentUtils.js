// Utility to generate a unique payment number/reference
function generatePaymentNumber() {
  const prefix = 'PAY';
  const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${date}-${random}`;
}

export { generatePaymentNumber };
