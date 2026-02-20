import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ account, roles }) => {
  const getRoleName = () => {
    if (roles.isAdmin) return 'Administrator';
    if (roles.isLawEnforcement) return 'Law Enforcement';
    if (roles.isForensicLab) return 'Forensic Lab';
    if (roles.isCourt) return 'Court';
    return 'No Role';
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🔐 Evidence Chain
      </div>
      <div className="navbar-info">
        <div className="role-badge">{getRoleName()}</div>
        <div className="account-address" title={account}>
          {formatAddress(account)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
