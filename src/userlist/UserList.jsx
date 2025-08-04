import axios from "axios";
import "./userlist.css";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
const UserList = () => {
  const [users, setUsers] = useState([]);

  console.log("users", users);
  const getUsersList = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <div className='user-table-container'>
      <div className='search-bar-wrapper'>
        <Search className='search-icon' size={18} />
        <input
          type='text'
          className='search-input'
          placeholder='Search by ID or Name'
        />
      </div>

      <table className='user-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address (City & Zipcode)</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? "even" : "odd"}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                {user.address.city}, {user.address.zipcode}
              </td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
