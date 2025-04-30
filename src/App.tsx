import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    axios.get('https://api.example.com/data')
      .then((response) => {
        setApiData(response.data);
        console.log('API data fetched successfully:', response.data);
      })
      .catch((error: any) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  return (
    <>
      {/* ...existing code... */}
      <div>
        <h2>API Data:</h2>
        {apiData ? (
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default App;
