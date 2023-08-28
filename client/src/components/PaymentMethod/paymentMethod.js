import React from 'react';

const PaymentMethodComponent = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
      <option value="">Select Payment Method</option>
      <option value="efectivo">Efectivo</option>
      <option value="sinpe_transferencia">Sinpe o Transferencia</option>
      <option value="tarjeta">Tarjeta</option>
    </select>
  );
};

export default PaymentMethodComponent;
