import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-بعمم bg-gray-100 text-white p-4">
      <ul>
       
        <li>
          <Link to="/upload" className="block py-2 text-gray-800 px-4 hover:bg-gray-200">Upload Certificate</Link>
        </li>
        <li>
          <Link to="/list" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">Certificate List</Link>
        </li>
        {/* <li>
          <Link to="/file" className="block py-2 px-4 hover:bg-gray-700">Bulk Upload</Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
