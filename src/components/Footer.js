/* frontend/src/components/Footer.js  */

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} ZeRoN AcademIA Platform. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;