import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './App.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const App = () => {
    const [data, setData] = useState({ customers: [], transactions: [] });
    const [filter, setFilter] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
    };

    const filteredCustomers = data.customers.filter(customer =>
        customer.name.toLowerCase().includes(filter.toLowerCase())
    );

    const customerTransactions = data.transactions.filter(transaction =>
        selectedCustomer && transaction.customer_id === selectedCustomer.id
    );

    const chartData = {
        labels: customerTransactions.map(transaction => transaction.date),
        datasets: [{
            label: 'Transaction Amount',
            data: customerTransactions.map(transaction => transaction.amount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        plugins: {
            legend: { labels: { color: '#ffffff' } },
            title: { display: true, text: 'Daily Transaction Amounts', color: '#ffffff' }
        },
        scales: {
            x: { ticks: { color: '#ffffff' } },
            y: { ticks: { color: '#ffffff' } }
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Customer Transactions</CardTitle>
                            <Input
                                type="text"
                                placeholder="Filter by customer name"
                                value={filter}
                                onChange={handleFilterChange}
                                className="mb-3"
                            />
                            <Table hover className="table-dark">
                                <thead><tr><th>Customer Name</th><th>Total Transactions</th></tr></thead>
                                <tbody>{filteredCustomers.map(customer => (
                                    <tr key={customer.id} onClick={() => handleCustomerClick(customer)} style={{ cursor: 'pointer' }}>
                                        <td>{customer.name}</td>
                                        <td>{data.transactions.filter(transaction => transaction.customer_id === customer.id).reduce((sum, transaction) => sum + transaction.amount, 0)}</td>
                                    </tr>))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {selectedCustomer && (
                <Row className="mt-4">
                    <Col><Card className="chart-container">
                            <CardBody>
                                <CardTitle tag="h5">Transactions for {selectedCustomer.name}</CardTitle>
                                <Bar data={chartData} options={chartOptions} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );};

export default App;
