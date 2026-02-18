import { useState, useEffect } from 'react';

const useJsonFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the file from the public directory path
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const json_data = await response.json();
        setData(json_data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run effect if the URL changes

  return { data, loading, error };
};

export default useJsonFetch;
