import React from 'react';
import { TokenTable } from './UserTable';

const UserTableWrapper: React.FC = () => {
  return (
    <div className="user-table-wrapper">
      <h3>User Table</h3>
      <TokenTable />
    </div>
  );
};

export default UserTableWrapper;
