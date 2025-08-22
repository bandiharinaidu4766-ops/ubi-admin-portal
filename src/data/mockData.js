// src/data/mockData.js

export const customers = [
  { id: 870998, name: "Sanjay", lastUsed: "25-01-2025 01:00 hrs IST" },
  { id: 870999, name: "Rahul", lastUsed: "25-01-2025 01:00 hrs IST" },
  { id: 871000, name: "Archana", lastUsed: "25-01-2025 01:00 hrs IST" },
  { id: 871001, name: "Amit", lastUsed: "25-01-2025 01:00 hrs IST" },
];

export const servicesData = {
  870998: { // Customer ID for Sanjay
    services: [
      { name: "Personal", count: 0 },
      { name: "Home", count: 1 },
      { name: "Vehicle", count: 2 },
      { name: "Education", count: 0 },
      { name: "Goldloan", count: 1 },
      { name: "Narishakti", count: 1 },
      { name: "Salary", count: 2 },
      { name: "Savings", count: 0 },
      { name: "Demat", count: 0 },
      { name: "FD", count: 1 },
      { name: "Internet", count: 2 },
    ],
  },
  // Add data for other customers if needed
};