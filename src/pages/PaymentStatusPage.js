//frontend/src/pages/PaymentStatusPage.js

import React, {
 // useEffect
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
//import '../styles/PaymentStatusPage.css';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const statusInfo = {
    success: {
      icon: <FaCheckCircle className="status-icon success" />,
      title: "¡Pago Exitoso!",
      message: "Tu plan ha sido activado. Ya puedes disfrutar de todos los beneficios."
    },
    failure: {
      icon: <FaTimesCircle className="status-icon failure" />,
      title: "Hubo un Problema",
      message: "No pudimos procesar tu pago. Por favor, intenta de nuevo."
    },
    pending: {
      icon: <FaClock className="status-icon pending" />,
      title: "Pago Pendiente",
      message: "Tu pago está siendo procesado. Te notificaremos cuando se apruebe."
    }
  };

  const currentStatus = statusInfo[status] || statusInfo['failure'];

  return (
    <div className="payment-status-page">
      <div className="payment-status-panel">
        {currentStatus.icon}
        <h1>{currentStatus.title}</h1>
        <p>{currentStatus.message}</p>
        <Link to="/dashboard" className="btn btn-primary">
          Ir a mi Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatusPage;