import axios from "axios";
import { useEffect, useState } from "react";

const apiString = "https://gtnjqqxk-3020.usw2.devtunnels.ms/";
interface User {
  id: string;
  username: string;
  preferences: {
    communicationPreferences: {
      text: boolean;
    phone: boolean;
    email: boolean;
    },
    darkMode: boolean;
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

  const handleUpdatePreferences = (username: string) => {
    const userToUpdate = users.find((user) => user.username === username);
    if (!userToUpdate) {
      console.error(`User with username ${username} not found`);
      return;
    }

    const updatedPreferences = {
      ...userToUpdate.preferences,
      // darkMode: !userToUpdate.preferences.darkMode, // Example: toggling darkMode
      // text: !userToUpdate.preferences.text, // Example: toggling text preference
      // phone: !userToUpdate.preferences.phone, // Example: toggling phone preference
      // email: !userToUpdate.preferences.email, // Example: toggling email preference
    };

    const updatedUser = { ...userToUpdate, preferences: updatedPreferences };

    axios
      .patch<User[]>(`${apiString}users/${userToUpdate.id}/preferences`, updatedUser)
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userToUpdate.id ? { ...user, ...updatedUser } : user
          )
        );
        console.log("Updated user preferences:", response.data);
      })
      .catch((error) => {
        console.error("Error updating user preferences:", error);
      });
  };

  const handleAddFavoriteColor = (username: string, color: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.username === username
          ? {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteColors: [...user.preferences.favoriteColors, color],
              },
            }
          : user
      )
    );
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
                    defaultChecked={!user.preferences.darkMode}
                  />
                  Light
                </label>
                <label>
                  <input
                    type="radio"
                    name={`theme-${index}`}
                    value="dark"
                    defaultChecked={user.preferences.darkMode}
                  />
                  Dark
                </label>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences.communicationPreferences.text}
                    readOnly
                  />
                  Text
                </label>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences.communicationPreferences.phone}
                    readOnly
                  />
                  Phone
                </label>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences.communicationPreferences.email}
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
                <select
                  onChange={(e) =>
                    handleAddFavoriteColor(user.username, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Add a color
                  </option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Yellow">Yellow</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Pink">Pink</option>
                    <option value="Green">Green</option>
                    <option value="CornflowerBlue">Cornflower Blue</option>
                </select>
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
