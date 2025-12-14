import React from 'react';
import { BsFillArchiveFill, BsPeopleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { LoanData } from './Tables/LoanData'; // ensure this matches your export

function Home() {
  const data = Array.isArray(LoanData) ? LoanData : [];

  // Totals
  const productCount = data.length;
  const categoryCount = data.some(d => 'category' in d)
    ? new Set(data.map(item => item.category)).size
    : 0;

  const totalAmount = data.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const actualAmount = data.reduce((sum, item) => sum + Number(item.actualAmount || 0), 0);

  // Bar Chart: top 10 by totalAmount
  const sortedByAmount = [...data].sort(
    (a, b) => Number(b.totalAmount || b.actualAmount || 0) - Number(a.totalAmount || a.actualAmount || 0)
  );

  const barData = sortedByAmount.slice(0, 10).map(item => ({
    name: item.name ?? 'Unknown',
    totalAmount: Number(item.totalAmount || item.actualAmount || 0),
    actualAmount: Number(item.actualAmount || 0),
  }));

  // ---------------- PIE CHART LOGIC ----------------
  // Show only customers with actualAmount < 30000
  const filteredPieData = data
    .filter(item => Number(item.actualAmount) < 30000)
    .map(item => ({
      name: item.name ?? 'Unknown',
      value: Number(item.totalAmount || item.actualAmount || 0),
      actualAmount: Number(item.actualAmount || 0)
    }));

  // Color generator (HSL wheel)
  const getColor = (i, total = filteredPieData.length) => {
    const hue = Math.round((i * 360) / Math.max(total, 12));
    return `hsl(${hue} 70% 50%)`;
  };

  const moneyFmt = num => Number(num).toLocaleString('en-IN');
  const barTooltipFormatter = value => `₹ ${moneyFmt(value)}`;
  const pieTooltipFormatter = value => `₹ ${moneyFmt(value)}`;
  const shortName = (name = '', max = 16) => (name.length > max ? name.slice(0, max - 1) + '…' : name);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <Link to="/ProductsTable" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='card-inner'>
              <h3>Total Chitti Customers</h3>
              <BsPeopleFill className='card_icon' />
            </div>
          </Link>
          <h1>{productCount}</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>This Quarterly Customers</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{categoryCount}</h1>
        </div>

        <div className='card'>
          <Link to="/CustomersTable" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='card-inner'>
              <h3>Principal Amount</h3>
              <BsFillArchiveFill className='card_icon' />
            </div>
            <h1>₹ {moneyFmt(actualAmount)}</h1>
          </Link>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>Total Amount with Interest</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>₹ {moneyFmt(totalAmount)}</h1>
        </div>
      </div>

      <div className='charts' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        {/* Bar Chart */}
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => barTooltipFormatter(value)} />
              <Legend />
              <Bar dataKey="totalAmount" name="Total Amount">
                {barData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={getColor(index, barData.length)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Only ActualAmount < 30000 */}
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={30}
                label={({ name, value, payload }) =>
                  `${shortName(name)} ₹${moneyFmt(value)} (₹${moneyFmt(payload.actualAmount)})`
                }
              >
                {filteredPieData.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => pieTooltipFormatter(value)} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
