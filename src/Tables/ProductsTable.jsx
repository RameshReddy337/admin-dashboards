import React, { useState, useMemo } from 'react';
import './ProductsTable.css';
import {
  BsFilter,
  BsSortAlphaDown,
  BsSortAlphaUp,
  BsSortNumericDownAlt,
  BsSortNumericUpAlt,
} from 'react-icons/bs';

export default function ProductsTable() {
  // Demo data (you can later fetch this from an API)
  const [products, setProducts] = useState([
    { id: 1, name: 'Apple iPhone 15', category: 'Mobiles', price: 79999, stock: 25 },
    { id: 2, name: 'Samsung Galaxy S24', category: 'Mobiles', price: 74999, stock: 40 },
    { id: 3, name: 'HP Pavilion Laptop', category: 'Laptops', price: 65999, stock: 18 },
    { id: 4, name: 'Sony WH-1000XM5', category: 'Headphones', price: 29999, stock: 60 },
    { id: 5, name: 'Apple Watch Series 10', category: 'Wearables', price: 49999, stock: 30 },
    { id: 6, name: 'Apple 17', category: 'New Mobiles', price: 99999, stock: 10 },
  ]);

  // Sort state
  const [sortBy, setSortBy] = useState(null); // 'name' | 'category' | 'price' | 'stock'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Filter state
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [minStock, setMinStock] = useState('');

  const categories = useMemo(() => {
    const setCats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(setCats)];
  }, [products]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // toggle order
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let rows = products.slice();

    // Filters
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'All') {
      rows = rows.filter((p) => p.category === categoryFilter);
    }

    if (minStock !== '') {
      const n = Number(minStock);
      if (!Number.isNaN(n)) rows = rows.filter((p) => p.stock >= n);
    }

    // Sorting
    if (sortBy) {
      rows.sort((a, b) => {
        let A = a[sortBy];
        let B = b[sortBy];

        // normalize strings
        if (typeof A === 'string') A = A.toLowerCase();
        if (typeof B === 'string') B = B.toLowerCase();

        if (A < B) return sortOrder === 'asc' ? -1 : 1;
        if (A > B) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [products, searchText, categoryFilter, minStock, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchText('');
    setCategoryFilter('All');
    setMinStock('');
  };

  return (
    <div className="product-table-container">
      <h2 className="table-title">Product List</h2>

      <div className="controls">
        <div className="filter-left">
          <div className="search-box">
            <input
              placeholder="Search product name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="icon-btn" title="Filter">
              <BsFilter />
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            className="min-stock"
            type="number"
            placeholder="Min stock"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            min="0"
          />

          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>
        </div>

        <div className="stats">
          Showing <strong>{filteredAndSorted.length}</strong> of {products.length}
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th className="sortable">
              Product
              <button
                className="sort-btn"
                onClick={() => handleSort('name')}
                aria-label="sort by name"
              >
                {sortBy === 'name' ? (
                  sortOrder === 'asc' ? (
                    <BsSortAlphaDown />
                  ) : (
                    <BsSortAlphaUp />
                  )
                ) : (
                  <BsSortAlphaDown className="muted" />
                )}
              </button>
            </th>

            <th className="sortable">
              Category
              <button
                className="sort-btn"
                onClick={() => handleSort('category')}
                aria-label="sort by category"
              >
                {sortBy === 'category' ? (
                  sortOrder === 'asc' ? (
                    <BsSortAlphaDown />
                  ) : (
                    <BsSortAlphaUp />
                  )
                ) : (
                  <BsSortAlphaDown className="muted" />
                )}
              </button>
            </th>

            <th className="sortable">
              Price (₹)
              <button
                className="sort-btn"
                onClick={() => handleSort('price')}
                aria-label="sort by price"
              >
                {sortBy === 'price' ? (
                  sortOrder === 'asc' ? (
                    <BsSortNumericDownAlt />
                  ) : (
                    <BsSortNumericUpAlt />
                  )
                ) : (
                  <BsSortNumericDownAlt className="muted" />
                )}
              </button>
            </th>

            <th className="sortable">
              Stock
              <button
                className="sort-btn"
                onClick={() => handleSort('stock')}
                aria-label="sort by stock"
              >
                {sortBy === 'stock' ? (
                  sortOrder === 'asc' ? (
                    <BsSortNumericDownAlt />
                  ) : (
                    <BsSortNumericUpAlt />
                  )
                ) : (
                  <BsSortNumericDownAlt className="muted" />
                )}
              </button>
            </th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => alert(`Edit product: ${product.name}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


