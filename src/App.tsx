import axios from "axios";
import { useEffect, useState } from "react";

const apiString = "https://gtnjqqxk-3020.usw2.devtunnels.ms/";
interface User {
  id: string;
  username: string;
  preferences: {
    communicationPreferences: {
      text: boolean;
      email: boolean;
      phone: boolean;
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
      darkMode: !userToUpdate.preferences.darkMode, // Example: toggling darkMode
      favoriteColors: userToUpdate.preferences.favoriteColors, // Keeping the same favorite colors
      communicationPreferences: {
        ...userToUpdate.preferences.communicationPreferences,
        text: userToUpdate.preferences.communicationPreferences.text,
        phone: userToUpdate.preferences.communicationPreferences.phone,
        email: userToUpdate.preferences.communicationPreferences.email,
      },
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

  const handleSortFavoriteColors = (username: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.username === username) {
          const isSorted = user.preferences.favoriteColors.every(
            (color, index, arr) => index === 0 || arr[index - 1] <= color
          );
          return {
            ...user,
            preferences: {
              ...user.preferences,
              favoriteColors: isSorted
                ? [...user.preferences.favoriteColors]
                : [...user.preferences.favoriteColors].sort(),
            },
          };
        }
        return user;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    axios
      .delete(`${apiString}users/${userId}`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== userId)
        );
        console.log(`User ${userId} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Error deleting user ${userId}:`, error);
      });
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
                    onClick={() => user.preferences.communicationPreferences.text = !user.preferences.communicationPreferences.text}
                  />
                  Text
                </label>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences.communicationPreferences.phone}
                    onClick={() => user.preferences.communicationPreferences.phone = !user.preferences.communicationPreferences.phone}
                  />
                  Phone
                </label>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences.communicationPreferences.email}
                    onClick={() => user.preferences.communicationPreferences.email = !user.preferences.communicationPreferences.email}
                  />
                  Email
                </label>
              </td>
              <td>
                <button onClick={() => handleSortFavoriteColors(user.username)}>
                  Sort Colors
                </button>
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
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete User
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
