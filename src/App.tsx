import axios from "axios";
import { useEffect, useState } from "react";

const apiString = "https://gtnjqqxk-3020.usw2.devtunnels.ms/";
interface User {
  id: string;
  username: string;
  preferences: {
    lightdark: boolean;
    text: boolean;
    phone: boolean;
    email: boolean;
    favoriteColors: string[];
  };
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get<User[]>(apiString+"users")
      .then((response) => {
        setUsers(response.data);
        console.log('response', response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .patch<User[]>(apiString+"users")
      .then((response) => {
        setUsers(response.data);
        console.log('response', response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUpdatePreferences = (username: string) => {
    console.log(`Update preferences for ${username}`);
    // Logic to update user preferences can be added here
  };

  return (
    <div>
      <h1>User Preferences</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Theme</th>
            <th>Communication Preferences</th>
            <th>Favorite Colors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>
                <label>
                  <input
                    type="radio"
                    name={`theme-${index}`}
                    value="light"
                    checked={user.preferences.lightdark}
                    readOnly
                  />
                  Light
                </label>
                <label>
                  <input
                    type="radio"
                    name={`theme-${index}`}
                    value="dark"
                    checked={user.preferences.lightdark}
                    readOnly
                  />
                  Dark
                </label>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={user.preferences.text}
                    readOnly
                  />
                  Text
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={user.preferences.phone}
                    readOnly
                  />
                  Phone
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={user.preferences.email}
                    readOnly
                  />
                  Email
                </label>
              </td>
              <td>
                <ol>
                  {user.preferences.favoriteColors.map((color, colorIndex) => (
                    <li key={colorIndex}>{color}</li>
                  ))}
                </ol>
              </td>
              <td>
                <button onClick={() => handleUpdatePreferences(user.username)}>
                  Update Preferences
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
