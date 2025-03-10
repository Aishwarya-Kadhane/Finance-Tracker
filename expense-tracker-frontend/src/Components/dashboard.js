import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/transactions"; // Replace with your backend URL

const ExpenseDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "Food",
    amount: "",
  });
  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const totalExpenses = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const today = moment().format("YYYY-MM-DD");
  const dailyExpenses = transactions
    .filter((t) => t.date === today)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const currentMonth = moment().format("YYYY-MM");
  const monthlyExpenses = transactions
    .filter((t) => t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenseBreakdown = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const expenseBreakdownData = Object.entries(expenseBreakdown).map(
    ([category, amount]) => ({ category, amount })
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FF8"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      try {
        const response = await axios.post(API_BASE_URL, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
        setTransactions((prev) => [...prev, response.data]);
        setFormData({
          date: "",
          description: "",
          category: "Food",
          amount: "",
        });
      } catch (error) {
        console.error("Error adding transaction:", error);
      }
    }
  };

  return (
    <Container fluid className="p-0">
      <Row>
        <Col md="12" className="p-4">
          <Row className="mb-4">
            <Col md="4">
              <Card className="shadow-sm bg-danger text-white" style={{height:"150px", textAlign:"center", fontSize:"1.5rem"}}>
                <CardBody>
                  <CardTitle>Total Expenses</CardTitle>
                  <h2>₹{totalExpenses.toFixed(2)}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-sm bg-info text-white" style={{height:"150px", textAlign:"center", fontSize:"1.5rem"}}>
                <CardBody>
                  <CardTitle>Daily Expenses</CardTitle>
                  <h2>₹{dailyExpenses.toFixed(2)}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-sm bg-warning text-white" style={{height:"150px", textAlign:"center", fontSize:"1.5rem"}}>
                <CardBody>
                  <CardTitle>Monthly Expenses</CardTitle>
                  <h2>₹{monthlyExpenses.toFixed(2)}</h2>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <Card className="shadow-sm">
                <CardBody>
                  <CardTitle>Add Expense</CardTitle>
                  <Form onSubmit={handleFormSubmit}>
                    <FormGroup>
                      <Label for="date">Date</Label>
                      <Input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="category">Category</Label>
                      <Input
                        type="select"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        {["Food", "Transport", "Utilities", "Entertainment", "Others"].map(
                          (cat) => (
                            <option key={cat}>{cat}</option>
                          )
                        )}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="amount">Amount</Label>
                      <Input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <Button color="primary" type="submit">
                      Add Expense
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="shadow-sm">
                <CardBody>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={expenseBreakdownData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Card className="shadow-sm">
                <CardBody>
                  <CardTitle>Transaction History</CardTitle>
                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (

                        <tr>
                          <td colSpan="4" className="text-center">
                            No transactions added yet.
                          </td>
                        </tr>

                      ) : (
                        transactions.map((t, index) => (
                          <tr key={index}>
                            <td>{t.date}</td>
                            <td>{t.description}</td>
                            <td>{t.category}</td>
                            <td>₹{t.amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpenseDashboard;
