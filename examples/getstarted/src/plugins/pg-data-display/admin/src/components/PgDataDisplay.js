import React, { useEffect, useState } from 'react';
import { Typography, Table, Box } from '@strapi/design-system';

const PgDataDisplay = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the plugin's backend API
    const fetchData = async () => {
      try {
        const response = await fetch('/pg-data');  // This calls the backend route
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data from PostgreSQL:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box padding={6}>
      <Typography variant="alpha" as="h2">
        PostgreSQL Data
      </Typography>
      <Table colCount={3} rowCount={data.length}>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default PgDataDisplay;
