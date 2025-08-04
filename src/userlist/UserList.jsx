import axios from "axios";
import "./userlist.css";
import { useEffect, useState } from "react";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Search,
  TriangleAlert,
} from "lucide-react";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

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
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
  };
  const renderSortIcon = (columnKey, sortKey, sortOrder) => {
    if (columnKey !== sortKey) return null;
    const Icon = sortOrder === "asc" ? ArrowDownNarrowWide : ArrowUpNarrowWide;

    return (
      <Icon
        size={16}
        className='sort-icon'
        style={{ display: "inline-block", verticalAlign: "middle" }}
      />
    );
  };
  useEffect(() => {
    const list = users
      .filter(
        (item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.id.toString().includes(debouncedSearch)
      )
      .sort((a, b) => {
        if (sortKey === "id") {
          return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
        }
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
    setFilteredUsers(list);
  }, [users, debouncedSearch, sortKey, sortOrder]);
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
        <h2>Users List</h2>
        <div className='search-bar'>
          <Search className='search-icon' size={18} />
          <input
            type='text'
            className='search-input'
            placeholder='Search by ID or Name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {filteredUsers.length > 0 ? (
        <table className='user-table'>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID {renderSortIcon("id", sortKey, sortOrder)}
              </th>
              <th onClick={() => handleSort("name")}>
                Name {renderSortIcon("name", sortKey, sortOrder)}
              </th>
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
