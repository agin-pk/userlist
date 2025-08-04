import axios from "axios";
import "./userlist.css";
import { useEffect, useState } from "react";
import { Search, TriangleAlert } from "lucide-react";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  console.log("filteredUsers", filteredUsers);

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
    const list = users.filter(
      (item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.id.toString().includes(debouncedSearch)
    );
    setFilteredUsers(list);
  }, [users, debouncedSearch]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredUsers.length > 0 ? (
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
            {filteredUsers?.map((user, index) => (
              <tr key={user?.id} className={index % 2 === 0 ? "even" : "odd"}>
                <td>{user?.id}</td>
                <td>{user?.name}</td>
                <td>
                  {user?.address?.city}, {user?.address?.zipcode}
                </td>
                <td>{user?.company?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='no-user'>
          <TriangleAlert size={50} className='no-user-icon' />
          <h2>No User Found</h2>
        </div>
      )}
    </div>
  );
};

export default UserList;
