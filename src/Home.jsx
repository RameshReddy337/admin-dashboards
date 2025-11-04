import React from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
    from 'react-icons/bs'
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {CustomerData} from './Tables/CustomerData';

function Home() {

    const data = [
        { id: 1, name: 'Apple iPhone 15', category: 'Mobiles', price: 79999, stock: 25 },
        { id: 2, name: 'Samsung Galaxy S24', category: 'Mobiles', price: 74999, stock: 40 },
        { id: 3, name: 'HP Pavilion Laptop', category: 'Laptops', price: 65999, stock: 18 },
        { id: 4, name: 'Sony WH-1000XM5', category: 'Headphones', price: 29999, stock: 60 },
        { id: 5, name: 'Apple Watch Series 10', category: 'Wearables', price: 49999, stock: 30 },
        { id: 6, name: 'Apple 17', category: 'New Mobiles', price: 99999, stock: 10 },
    ];

    const productCount = data.length;
    const categoryCount = new Set(data.map(item => item.category)).size;
    const priceSum = data.reduce((sum, item) => sum + item.price, 0);
    const stockSum = data.reduce((sum, item) => sum + item.stock, 0);
    const customerCount = CustomerData.length // Example static value
    // Shared color palette for both charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF4C4C'];

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            {/* ====== Cards Section ====== */}
            <div className='main-cards'>
                <div className='card'>
                    <Link to="/ProductsTable" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className='card-inner'>
                            <h3>PRODUCTS</h3>
                            <BsFillArchiveFill className='card_icon' />
                        </div>
                    </Link>
                    <h1>{productCount}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>CATEGORIES</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>{categoryCount}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>CUSTOMERS</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{customerCount}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>ALERTS</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1>{stockSum}</h1>
                </div>
            </div>

            {/* ====== Charts Section ====== */}
            <div className='charts'>

                {/* === Bar Chart === */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stock">
                            {data.map((entry, index) => (
                                <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* === Pie Chart === */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="stock"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

            </div>
        </main>
    )
}

export default Home
