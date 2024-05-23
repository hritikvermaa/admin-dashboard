import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import './Table.css';  // Assuming you have a CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css';

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://openlibrary.org/search.json?q=the+lord+of+the+rings&page=2')
      .then(response => {
        const books = response.data.docs.map(book => ({
          rating_average: book.rating_average || 'N/A',
          author_name: book.author_name ? book.author_name.join(', ') : 'N/A',
          title: book.title,
          first_publish_year: book.first_publish_year || 'N/A',
          subject: book.subject ? book.subject.join(', ') : 'N/A',
          author_birth_date: book.author_birth_date || 'N/A',
          author_top_work: book.author_top_work || 'N/A'
        }));
        setData(books);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rating Average',
        accessor: 'rating_average'
      },
      {
        Header: 'Author Name',
        accessor: 'author_name'
      },
      {
        Header: 'Title',
        accessor: 'title'
      },
      {
        Header: 'First Publish Year',
        accessor: 'first_publish_year'
      },
      {
        Header: 'Subject',
        accessor: 'subject'
      },
      {
        Header: 'Author Birth Date',
        accessor: 'author_birth_date'
      },
      {
        Header: 'Author Top Work',
        accessor: 'author_top_work'
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="App">
      <h1>Books Table</h1>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <i className="fas fa-sort-down"></i>
                        : <i className="fas fa-sort-up"></i>
                      : <i className="fas fa-sort"></i>}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;