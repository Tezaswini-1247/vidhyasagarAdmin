import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHeader, TableBody, TableCell, TableRow } from '@strapi/design-system';
import axios from 'axios';

const PgDataPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/pg-data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box padding={8}>
      <Typography variant="alpha">PostgreSQL Data</Typography>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Replace with your table's column headers */}
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {/* Replace with your table's data */}
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PgDataPage;
