const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;


// Basic Auth Configuration
const basicAuthConfig = {
  users: {},
  challenge: true,
  realm: 'ERP Integration API',
  unauthorizedResponse: (req) => {
    return {
      success: false,
      message: 'Authentication required',
      timestamp: new Date().toISOString()
    };
  }
};

// Set up Basic Auth credentials from environment variables
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'password123';

// Add credentials to basicAuth config
basicAuthConfig.users[AUTH_USERNAME] = AUTH_PASSWORD;

// Middleware
app.use(cors());
app.use(express.json());

// Apply Basic Auth to all routes except health check
app.use('/health', (req, res, next) => next()); // Skip auth for health check
app.use(basicAuth(basicAuthConfig));

// ======= DUMMY DATA (EXPANDED - MULTIPLE ASSOCIATIONS) =======

// Contacts dummy data - Updated to support multiple associations for same email

// ======= CONTACTS DUMMY DATA =======
let contacts = [
  {
    name: "John Doe",
    email: "john.doe@techcorp.com",
    jobTitle: "Procurement Manager",
    phone: "+1-555-101-2001",
    contactId: "CONT_001",
    erpId: "ERP_SAP_01",
    address: "123 Main St, New York, NY"
  },
  {
    name: "John Doe",
    email: "john.doe@techcorp.com", // Same email, different ERP
    jobTitle: "Procurement Manager",
    phone: "+1-555-101-2001",
    contactId: "CONT_007",
    erpId: "ERP_ORACLE_02",
    address: "123 Main St, New York, NY"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@innovate.com",
    jobTitle: "Senior Buyer",
    phone: "+1-555-202-3002",
    contactId: "CONT_002",
    erpId: "ERP_ORACLE_01",
    address: "456 Market Ave, San Francisco, CA"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@innovate.com", // Same email, different contact/ERP
    jobTitle: "Senior Buyer - Division 2",
    phone: "+1-555-202-3002",
    contactId: "CONT_008",
    erpId: "ERP_SAP_02",
    address: "456 Market Ave, San Francisco, CA"
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@techcorp.com",
    jobTitle: "Operations Director",
    phone: "+1-555-303-4003",
    contactId: "CONT_003",
    erpId: "ERP_SAP_01",
    address: "789 Broadway Blvd, Chicago, IL"
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@globaltech.com",
    jobTitle: "Category Manager",
    phone: "+1-555-404-5004",
    contactId: "CONT_004",
    erpId: "ERP_DYNAMICS_01",
    address: "321 Innovation Rd, Austin, TX"
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@globaltech.com", // Same email, same contact, different ERP
    jobTitle: "Category Manager - EU Division",
    phone: "+1-555-404-5004",
    contactId: "CONT_004",
    erpId: "ERP_DYNAMICS_02",
    address: "321 Innovation Rd, Austin, TX"
  },
  {
    name: "Robert Brown",
    email: "robert.brown@innovate.com",
    jobTitle: "Finance Manager",
    phone: "+1-555-505-6005",
    contactId: "CONT_005",
    erpId: "ERP_ORACLE_01",
    address: "654 Enterprise Ln, Seattle, WA"
  },
  {
    name: "Emily Davis",
    email: "emily.davis@startuphub.com",
    jobTitle: "Product Manager",
    phone: "+1-555-606-7006",
    contactId: "CONT_006",
    erpId: "ERP_NETSUITE_01",
    address: "987 Innovation Dr, Denver, CO"
  },
  {
    name: "David Martinez",
    email: "david.martinez@enterprisetech.com",
    jobTitle: "Supply Chain Manager",
    phone: "+1-555-707-8007",
    contactId: "CONT_009",
    erpId: "ERP_SAP_03",
    address: "159 Corporate Way, Phoenix, AZ"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@globaltech.com",
    jobTitle: "Vendor Relations Specialist",
    phone: "+1-555-808-9008",
    contactId: "CONT_010",
    erpId: "ERP_DYNAMICS_01",
    address: "753 Technology Blvd, Portland, OR"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@globaltech.com", // Same email, different contact/ERP
    jobTitle: "Vendor Relations - Asia Pacific",
    phone: "+1-555-808-9008",
    contactId: "CONT_011",
    erpId: "ERP_DYNAMICS_03",
    address: "753 Technology Blvd, Portland, OR"
  },
  {
    name: "Christopher Lee",
    email: "chris.lee@innovate.com",
    jobTitle: "Purchasing Director",
    phone: "+1-555-909-1009",
    contactId: "CONT_012",
    erpId: "ERP_ORACLE_01",
    address: "246 Business Center Dr, Miami, FL"
  },
  {
    name: "Amanda Taylor",
    email: "amanda.taylor@techcorp.com",
    jobTitle: "Strategic Sourcing Manager",
    phone: "+1-555-111-2010",
    contactId: "CONT_013",
    erpId: "ERP_SAP_01",
    address: "369 Industry Ave, Dallas, TX"
  },
  {
    name: "Kevin White",
    email: "kevin.white@enterprisetech.com",
    jobTitle: "Operations Manager",
    phone: "+1-555-222-3011",
    contactId: "CONT_014",
    erpId: "ERP_SAP_03",
    address: "852 Commerce St, Atlanta, GA"
  },
  {
    name: "Rachel Green",
    email: "rachel.green@startuphub.com",
    jobTitle: "Procurement Specialist",
    phone: "+1-555-333-4012",
    contactId: "CONT_015",
    erpId: "ERP_NETSUITE_01",
    address: "741 Startup Lane, Boulder, CO"
  },
  {
    name: "Thomas Clark",
    email: "thomas.clark@futuretech.com",
    jobTitle: "Category Director",
    phone: "+1-555-444-5013",
    contactId: "CONT_016",
    erpId: "ERP_WORKDAY_01",
    address: "963 Future Blvd, San Diego, CA"
  },
  {
    name: "Jennifer Lewis",
    email: "jennifer.lewis@globaltech.com",
    jobTitle: "Contract Manager",
    phone: "+1-555-555-6014",
    contactId: "CONT_017",
    erpId: "ERP_DYNAMICS_02",
    address: "147 Contract Way, Nashville, TN"
  },
  {
    name: "Mark Thompson",
    email: "mark.thompson@techcorp.com",
    jobTitle: "Vendor Manager",
    phone: "+1-555-666-7015",
    contactId: "CONT_018",
    erpId: "ERP_SAP_01",
    address: "258 Vendor St, Las Vegas, NV"
  },
  {
    name: "Sarah Collins",
    email: "sarah.collins@vomelademo.com",
    jobTitle: "Senior Procurement Analyst",
    phone: "+1-555-777-8016",
    contactId: "CONT_019",
    erpId: "ERP_ORACLE_03",
    address: "369 Analysis Ave, Salt Lake City, UT"
  },
  {
    name: "Isabella Rodriguez",
    email: "isabella.r@globalbiz.com",
    jobTitle: "Supply Chain Manager",
    phone: "+1-555-404-0010",
    contactId: "CONT_021",
    erpId: "ERP_SF_03",
    address: "789 Global Plaza, Austin, TX"
  },
  {
    name: "Emily Roberts",
    email: "emily.roberts@vomelademo.com",
    jobTitle: "Senior Product Analyst",
    phone: "+1-555-777-8016",
    contactId: "CONT_022",
    erpId: "ERP_SAP_05",
    address: "369 Analysis Ave, Salt Lake City, UT"
  }
];

// Orders dummy data - Updated with more varied associations
// ======= ORDERS DUMMY DATA =======

let orders = [
  {
    identifier: "ORD_001",
    name: "Office Supplies Q1",
    date: "2024-01-15T10:30:00Z",
    status: "approved",
    total: 2849.75,
    erpId: "ERP_SAP_01",
    contactId: "CONT_001",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_002",
    name: "IT Equipment Upgrade",
    date: "2024-01-18T14:20:00Z",
    status: "pending",
    total: 42049.85,
    erpId: "ERP_ORACLE_01",
    contactId: "CONT_002",
    CSREmail: "robert.vardy@gmail.com",
    CSRName: "Robert Vardy",
    companyName: "Innovate Ltd"
  },
  {
    identifier: "ORD_003",
    name: "Marketing Materials",
    date: "2024-01-20T09:15:00Z",
    status: "shipped",
    total: 1365.00,
    erpId: "ERP_SAP_01",
    contactId: "CONT_003",
    CSREmail: "sarah@gmail.com",
    CSRName: "Sarah Costa",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_004",
    name: "Facility Maintenance",
    date: "2024-01-22T16:45:00Z",
    status: "delivered",
    total: 4649.90,
    erpId: "ERP_DYNAMICS_01",
    contactId: "CONT_004",
    CSREmail: "robert.vardy@gmail.com",
    CSRName: "Robert Vardy",
    companyName: "GlobalTech"
  },
  {
    identifier: "ORD_005",
    name: "Software Licenses",
    date: "2024-01-25T11:30:00Z",
    status: "approved",
    total: 8900.00,
    erpId: "ERP_ORACLE_01",
    contactId: "CONT_005",
    CSREmail: "robert.vardy@gmail.com",
    CSRName: "Robert Vardy",
    companyName: "Innovate Ltd"
  },
  {
    identifier: "ORD_006",
    name: "Startup Launch Kits",
    date: "2024-01-28T13:00:00Z",
    status: "pending",
    total: 1500.00,
    erpId: "ERP_NETSUITE_01",
    contactId: "CONT_006",
    CSREmail: "emily.davis@startuphub.com",
    CSRName: "Emily Davis",
    companyName: "StartupHub"
  },
  {
    identifier: "ORD_007",
    name: "Oracle Division Order",
    date: "2024-01-30T12:00:00Z",
    status: "pending",
    total: 5500.00,
    erpId: "ERP_ORACLE_02",
    contactId: "CONT_007",
    CSREmail: "oracle.csr@gmail.com",
    CSRName: "Oracle CSR",
    companyName: "TechCorp Oracle Division"
  },
  {
    identifier: "ORD_008",
    name: "SAP Division 2 Order",
    date: "2024-02-01T15:30:00Z",
    status: "approved",
    total: 3200.00,
    erpId: "ERP_SAP_02",
    contactId: "CONT_008",
    CSREmail: "sap2.csr@gmail.com",
    CSRName: "SAP2 CSR",
    companyName: "Innovate SAP Division 2"
  },
  {
    identifier: "ORD_009",
    name: "EU Division Order",
    date: "2024-02-02T10:15:00Z",
    status: "shipped",
    total: 7800.00,
    erpId: "ERP_DYNAMICS_02",
    contactId: "CONT_004",
    CSREmail: "eu.csr@gmail.com",
    CSRName: "EU CSR",
    companyName: "GlobalTech EU"
  },
  {
    identifier: "ORD_010",
    name: "Enterprise Hardware Bundle",
    date: "2024-02-05T09:30:00Z",
    status: "pending",
    total: 18049.42,
    erpId: "ERP_SAP_03",
    contactId: "CONT_009",
    CSREmail: "enterprise.csr@gmail.com",
    CSRName: "Enterprise CSR",
    companyName: "EnterpriseTech"
  },
  {
    identifier: "ORD_011",
    name: "Vendor Management Tools",
    date: "2024-02-07T11:45:00Z",
    status: "approved",
    total: 4200.00,
    erpId: "ERP_DYNAMICS_01",
    contactId: "CONT_010",
    CSREmail: "vendor.csr@gmail.com",
    CSRName: "Vendor CSR",
    companyName: "GlobalTech"
  },
  {
    identifier: "ORD_012",
    name: "Asia Pacific Equipment",
    date: "2024-02-08T14:20:00Z",
    status: "pending",
    total: 11960.00,
    erpId: "ERP_DYNAMICS_03",
    contactId: "CONT_011",
    CSREmail: "apac.csr@gmail.com",
    CSRName: "APAC CSR",
    companyName: "GlobalTech APAC"
  },
  {
    identifier: "ORD_013",
    name: "Strategic Sourcing Platform",
    date: "2024-02-10T16:00:00Z",
    status: "approved",
    total: 15200.00,
    erpId: "ERP_ORACLE_01",
    contactId: "CONT_012",
    CSREmail: "strategic.csr@gmail.com",
    CSRName: "Strategic CSR",
    companyName: "Innovate Ltd"
  },
  {
    identifier: "ORD_014",
    name: "Q1 Office Renovation",
    date: "2024-02-12T08:15:00Z",
    status: "shipped",
    total: 8324.70,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "renovation.csr@gmail.com",
    CSRName: "Renovation CSR",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_015",
    name: "Operations Optimization Kit",
    date: "2024-02-14T13:30:00Z",
    status: "pending",
    total: 10500.00,
    erpId: "ERP_NETSUITE_01",
    contactId: "CONT_006",
    CSREmail: "operations.csr@gmail.com",
    CSRName: "Operations CSR",
    companyName: "EnterpriseTech"
  },
  {
    identifier: "ORD_016",
    name: "Startup Growth Package",
    date: "2024-02-15T10:45:00Z",
    status: "approved",
    total: 4865.00,
    erpId: "ERP_NETSUITE_01",
    contactId: "CONT_015",
    CSREmail: "growth.csr@gmail.com",
    CSRName: "Growth CSR",
    companyName: "StartupHub"
  },
  {
    identifier: "ORD_017",
    name: "Future Tech Solutions",
    date: "2024-02-18T15:20:00Z",
    status: "shipped",
    total: 11200.00,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "future.csr@gmail.com",
    CSRName: "Future CSR",
    companyName: "FutureTech"
  },
  {
    identifier: "ORD_018",
    name: "Contract Management Suite",
    date: "2024-02-20T12:00:00Z",
    status: "shipped",
    total: 7300.00,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "contract.csr@gmail.com",
    CSRName: "Contract CSR",
    companyName: "GlobalTech EU"
  },
  {
    identifier: "ORD_019",
    name: "Vendor Analytics Platform",
    date: "2024-02-22T14:15:00Z",
    status: "approved",
    total: 5800.00,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "analytics.csr@gmail.com",
    CSRName: "Analytics CSR",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_020",
    name: "Procurement Analysis Tools",
    date: "2024-02-25T09:30:00Z",
    status: "pending",
    total: 5250.00,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "analysis.csr@gmail.com",
    CSRName: "Analysis CSR",
    companyName: "Innovate Analytics Division"
  },
  {
      identifier: "ORD_020_1",
      name: "Order #1",
      date: "2024-03-01T10:00:00Z",
      status: "approved",
      total: 3500.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_2",
      name: "Order #2",
      date: "2024-03-02T11:15:00Z",
      status: "pending",
      total: 520.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_3",
      name: "Order #3",
      date: "2024-03-03T14:30:00Z",
      status: "shipped",
      total: 120.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_4",
      name: "Order #4",
      date: "2024-03-04T09:45:00Z",
      status: "delivered",
      total: 2300.75,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_5",
      name: "Order #5",
      date: "2024-03-05T16:00:00Z",
      status: "approved",
      total: 450.25,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_6",
      name: "Order #6",
      date: "2024-03-06T12:00:00Z",
      status: "pending",
      total: 680.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_7",
      name: "Order #7",
      date: "2024-03-07T10:30:00Z",
      status: "shipped",
      total: 1200.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_8",
      name: "Order #8",
      date: "2024-03-08T09:10:00Z",
      status: "delivered",
      total: 95.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_9",
      name: "Order #9",
      date: "2024-03-09T15:20:00Z",
      status: "approved",
      total: 780.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_10",
      name: "Order #10",
      date: "2024-03-10T11:00:00Z",
      status: "pending",
      total: 1500.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_11",
      name: "Order #11",
      date: "2024-03-11T13:45:00Z",
      status: "shipped",
      total: 320.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_12",
      name: "Order #12",
      date: "2024-03-12T10:00:00Z",
      status: "delivered",
      total: 850.25,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_13",
      name: "Order #13",
      date: "2024-03-13T14:15:00Z",
      status: "approved",
      total: 600.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_14",
      name: "Order #14",
      date: "2024-03-14T11:30:00Z",
      status: "pending",
      total: 425.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_15",
      name: "Order #15",
      date: "2024-03-15T15:00:00Z",
      status: "shipped",
      total: 980.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_16",
      name: "Order #16",
      date: "2024-03-16T10:45:00Z",
      status: "delivered",
      total: 120.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_17",
      name: "Order #17",
      date: "2024-03-17T12:30:00Z",
      status: "approved",
      total: 550.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_18",
      name: "Order #18",
      date: "2024-03-18T09:00:00Z",
      status: "pending",
      total: 75.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_19",
      name: "Order #19",
      date: "2024-03-19T14:20:00Z",
      status: "shipped",
      total: 1800.75,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_20",
      name: "Order #20",
      date: "2024-03-20T11:45:00Z",
      status: "delivered",
      total: 350.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_21",
      name: "Order #21",
      date: "2024-03-21T10:00:00Z",
      status: "approved",
      total: 450.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_22",
      name: "Order #22",
      date: "2024-03-22T12:00:00Z",
      status: "pending",
      total: 750.50,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_23",
      name: "Order #23",
      date: "2024-03-23T14:00:00Z",
      status: "shipped",
      total: 1200.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_24",
      name: "Order #24",
      date: "2024-03-24T10:30:00Z",
      status: "delivered",
      total: 85.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_25",
      name: "Order #25",
      date: "2024-03-25T15:00:00Z",
      status: "approved",
      total: 220.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_26",
      name: "Order #26",
      date: "2024-03-26T09:00:00Z",
      status: "pending",
      total: 950.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_27",
      name: "Order #27",
      date: "2024-03-27T11:20:00Z",
      status: "shipped",
      total: 1600.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_28",
      name: "Order #28",
      date: "2024-03-28T10:30:00Z",
      status: "delivered",
      total: 55.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_29",
      name: "Order #29",
      date: "2024-03-29T14:45:00Z",
      status: "approved",
      total: 320.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_30",
      name: "Order #30",
      date: "2024-03-30T10:00:00Z",
      status: "pending",
      total: 85.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_31",
      name: "Order #31",
      date: "2024-03-31T12:00:00Z",
      status: "shipped",
      total: 1500.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_32",
      name: "Order #32",
      date: "2024-04-01T09:15:00Z",
      status: "delivered",
      total: 45.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_33",
      name: "Order #33",
      date: "2024-04-02T16:00:00Z",
      status: "approved",
      total: 650.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_34",
      name: "Order #34",
      date: "2024-04-03T11:00:00Z",
      status: "pending",
      total: 780.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_35",
      name: "Order #35",
      date: "2024-04-04T13:00:00Z",
      status: "shipped",
      total: 920.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_36",
      name: "Order #36",
      date: "2024-04-05T10:00:00Z",
      status: "delivered",
      total: 120.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_37",
      name: "Order #37",
      date: "2024-04-06T15:30:00Z",
      status: "approved",
      total: 450.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_38",
      name: "Order #38",
      date: "2024-04-07T11:45:00Z",
      status: "pending",
      total: 600.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_39",
      name: "Order #39",
      date: "2024-04-08T14:00:00Z",
      status: "shipped",
      total: 150.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_40",
      name: "Order #40",
      date: "2024-04-09T09:30:00Z",
      status: "delivered",
      total: 850.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_41",
      name: "Order #41",
      date: "2024-04-10T16:00:00Z",
      status: "approved",
      total: 300.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_42",
      name: "Order #42",
      date: "2024-04-11T12:00:00Z",
      status: "pending",
      total: 520.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_43",
      name: "Order #43",
      date: "2024-04-12T10:30:00Z",
      status: "shipped",
      total: 750.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_44",
      name: "Order #44",
      date: "2024-04-13T09:00:00Z",
      status: "delivered",
      total: 95.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_45",
      name: "Order #45",
      date: "2024-04-14T15:00:00Z",
      status: "approved",
      total: 1200.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_46",
      name: "Order #46",
      date: "2024-04-15T11:15:00Z",
      status: "pending",
      total: 450.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_47",
      name: "Order #47",
      date: "2024-04-16T13:30:00Z",
      status: "shipped",
      total: 65.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_48",
      name: "Order #48",
      date: "2024-04-17T10:00:00Z",
      status: "delivered",
      total: 550.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_49",
      name: "Order #49",
      date: "2024-04-18T14:15:00Z",
      status: "approved",
      total: 85.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
    {
      identifier: "ORD_020_50",
      name: "Order #50",
      date: "2024-04-19T11:00:00Z",
      status: "pending",
      total: 150.00,
      erpId: "ERP_SF_03",
      contactId: "CONT_021",
      CSREmail: "ana.silva@globalbiz.com",
      CSRName: "Ana Silva",
      companyName: "Global Innovations Inc."
    },
  {
    identifier: "ORD_021",
    name: "Office Supplies Q1",
    date: "2024-01-15T10:30:00Z",
    status: "to approve",
    total: 2849.75,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_022",
    name: "Office Supplies Q2",
    date: "2024-02-20T11:00:00Z",
    status: "to approve",
    total: 3120.50,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_023",
    name: "Office Supplies Q3",
    date: "2024-03-10T14:15:00Z",
    status: "to approve",
    total: 1985.00,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_024",
    name: "Office Supplies Q4",
    date: "2024-04-05T09:45:00Z",
    status: "to approve",
    total: 4250.25,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_025",
    name: "Office Supplies Q5",
    date: "2024-05-18T16:20:00Z",
    status: "to approve",
    total: 2765.80,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_026",
    name: "Office Supplies Q6",
    date: "2024-06-22T13:10:00Z",
    status: "to approve",
    total: 3580.40,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_027",
    name: "Office Supplies Q7",
    date: "2024-07-08T08:55:00Z",
    status: "to approve",
    total: 2399.90,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_028",
    name: "Office Supplies Q8",
    date: "2024-08-14T17:40:00Z",
    status: "to approve",
    total: 4105.10,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_029",
    name: "Office Supplies Q9",
    date: "2024-09-03T12:25:00Z",
    status: "to approve",
    total: 2875.65,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_030",
    name: "Office Supplies Q10",
    date: "2024-10-29T15:05:00Z",
    status: "to approve",
    total: 3340.95,
    erpId: "ERP_SAP_05",
    contactId: "CONT_022",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_032",
    name: "Office Supplies Q1",
    date: "2024-01-15T10:30:00Z",
    status: "pending",
    total: 2849.75,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_033",
    name: "Office Supplies Q2",
    date: "2024-02-20T11:00:00Z",
    status: "approved",
    total: 3120.50,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_034",
    name: "Office Supplies Q3",
    date: "2024-03-10T14:15:00Z",
    status: "approved",
    total: 1985.00,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_035",
    name: "Office Supplies Q4",
    date: "2024-04-05T09:45:00Z",
    status: "approved",
    total: 4250.25,
    erpId: "ERP_ORACLE_03",
    contactId: "CONT_019",
    CSREmail: "jhon.scot@gmail.com",
    CSRName: "Jhon Scot",
    companyName: "TechCorp"
  }
    
];

// Approvers dummy data - Updated with more ERP associations
// ======= APPROVERS DUMMY DATA =======

let approvers = [
  { email: "manager@techcorp.com", erpId: "ERP_SAP_01", role: "Manager" },
  { email: "director@innovate.com", erpId: "ERP_ORACLE_01", role: "Director" },
  { email: "supervisor@globaltech.com", erpId: "ERP_DYNAMICS_01", role: "Supervisor" },
  { email: "admin@techcorp.com", erpId: "ERP_SAP_01", role: "Administrator" },
  { email: "procurement.head@innovate.com", erpId: "ERP_ORACLE_01", role: "Procurement Head" },
  { email: "oracle.manager@techcorp.com", erpId: "ERP_ORACLE_02", role: "Oracle Manager" },
  { email: "sap2.director@innovate.com", erpId: "ERP_SAP_02", role: "SAP2 Director" },
  { email: "eu.supervisor@globaltech.com", erpId: "ERP_DYNAMICS_02", role: "EU Supervisor" },
  { email: "enterprise.manager@enterprisetech.com", erpId: "ERP_SAP_03", role: "Enterprise Manager" },
  { email: "apac.director@globaltech.com", erpId: "ERP_DYNAMICS_03", role: "APAC Director" },
  { email: "strategic.head@innovate.com", erpId: "ERP_ORACLE_01", role: "Strategic Head" },
  { email: "operations.manager@enterprisetech.com", erpId: "ERP_SAP_03", role: "Operations Manager" },
  { email: "startup.supervisor@startuphub.com", erpId: "ERP_NETSUITE_01", role: "Startup Supervisor" },
  { email: "future.director@futuretech.com", erpId: "ERP_WORKDAY_01", role: "Future Director" },
  { email: "contract.manager@globaltech.com", erpId: "ERP_DYNAMICS_02", role: "Contract Manager" },
  { email: "analytics.head@techcorp.com", erpId: "ERP_SAP_01", role: "Analytics Head" },
  { email: "analysis.director@innovate.com", erpId: "ERP_ORACLE_03", role: "Analysis Director" },
  { email: "finance.controller@techcorp.com", erpId: "ERP_SAP_01", role: "Finance Controller" },
  { email: "vp.procurement@innovate.com", erpId: "ERP_ORACLE_01", role: "VP Procurement" },
  { email: "chief.operations@globaltech.com", erpId: "ERP_DYNAMICS_01", role: "Chief Operations" },
  { email: "supply.chain.lead@enterprisetech.com", erpId: "ERP_SAP_03", role: "Supply Chain Lead" },
  { email: "vendor.relations.head@globaltech.com", erpId: "ERP_DYNAMICS_01", role: "Vendor Relations Head" },
  { email: "purchasing.vp@innovate.com", erpId: "ERP_ORACLE_01", role: "Purchasing VP" },
  { email: "sourcing.director@techcorp.com", erpId: "ERP_SAP_01", role: "Sourcing Director" },
  { email: "procurement.specialist.lead@startuphub.com", erpId: "ERP_NETSUITE_01", role: "Procurement Specialist Lead" },
  { email: "category.head@futuretech.com", erpId: "ERP_WORKDAY_01", role: "Category Head" },
  { email: "contract.supervisor@globaltech.com", erpId: "ERP_DYNAMICS_02", role: "Contract Supervisor" },
  { email: "vendor.director@techcorp.com", erpId: "ERP_SAP_01", role: "Vendor Director" },
  { email: "senior.analyst.lead@innovate.com", erpId: "ERP_ORACLE_03", role: "Senior Analyst Lead" }
];

// Order Items dummy data - Updated with new order associations
// ======= ORDER ITEMS DUMMY DATA =======
let orderItems = [
  // Existing items
  {
    identifier: "OI_001",
    name: "Wireless Mouse",
    quantity: 50,
    unitPrice: 25.99,
    status: "pending",
    orderId: "ORD_001",
    approvers: ["manager@techcorp.com", "admin@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/wireless_mouse_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "Standard",
    color: "Black",
    paperStock: "Matte Coated"
  },
  {
    identifier: "OI_002",
    name: "Mechanical Keyboard",
    quantity: 25,
    unitPrice: 89.99,
    status: "pending",
    orderId: "ORD_001",
    approvers: ["manager@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/keyboard_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "18 x 6 inches",
    color: "White",
    paperStock: "Glossy Coated"
  },
  {
    identifier: "OI_003",
    name: "27-inch Monitor",
    quantity: 15,
    unitPrice: 299.99,
    status: "pending",
    orderId: "ORD_002",
    approvers: ["director@innovate.com", "procurement.head@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/monitor_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "27 inch",
    color: "Black",
    paperStock: "Matte"
  },
  {
    identifier: "OI_004",
    name: "Laptop Stand",
    quantity: 30,
    unitPrice: 45.50,
    status: "shipped",
    orderId: "ORD_003",
    approvers: ["manager@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/laptop_stand_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "Adjustable",
    color: "Silver",
    paperStock: "Glossy"
  },
  {
    identifier: "OI_005",
    name: "Enterprise SSD",
    quantity: 10,
    unitPrice: 189.99,
    status: "delivered",
    orderId: "ORD_004",
    approvers: ["supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/ssd_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "2.5 inch",
    color: "Black",
    paperStock: "Matte"
  },
  {
    identifier: "OI_006",
    name: "Startup T-Shirts",
    quantity: 100,
    unitPrice: 15.00,
    status: "pending",
    orderId: "ORD_006",
    approvers: ["emily.davis@startuphub.com"],
    imageUrl: "https://cdn.pixabay.com/photo/2014/11/22/11/59/magnifying-glass-541625_1280.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "M",
    color: "Blue",
    paperStock: "Cotton"
  },
  {
    identifier: "OI_007",
    name: "Oracle Software Package",
    quantity: 5,
    unitPrice: 1100.00,
    status: "pending",
    orderId: "ORD_007",
    approvers: ["oracle.manager@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/oracle_software_proof.jpg",
    erpId: "ERP_ORACLE_02",
    size: "Digital",
    color: "N/A",
    paperStock: "Digital License"
  },
  {
    identifier: "OI_008",
    name: "SAP Division 2 Hardware",
    quantity: 20,
    unitPrice: 160.00,
    status: "approved",
    orderId: "ORD_008",
    approvers: ["sap2.director@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/sap2_hardware_proof.jpg",
    erpId: "ERP_SAP_02",
    size: "Standard",
    color: "Gray",
    paperStock: "Metal"
  },
  {
    identifier: "OI_009",
    name: "EU Division Equipment",
    quantity: 12,
    unitPrice: 650.00,
    status: "shipped",
    orderId: "ORD_009",
    approvers: ["eu.supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/eu_equipment_proof.jpg",
    erpId: "ERP_DYNAMICS_02",
    size: "Large",
    color: "Blue",
    paperStock: "Industrial"
  },
  // Additional items for ORD_001
  {
    identifier: "OI_010",
    name: "Desk Lamp",
    quantity: 40,
    unitPrice: 35.75,
    status: "pending",
    orderId: "ORD_001",
    approvers: ["manager@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/desk_lamp_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "Adjustable",
    color: "White",
    paperStock: "Plastic"
  },
  // Additional items for ORD_002
  {
    identifier: "OI_011",
    name: "Wireless Headset",
    quantity: 20,
    unitPrice: 129.99,
    status: "pending",
    orderId: "ORD_002",
    approvers: ["director@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/headset_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Over-ear",
    color: "Black",
    paperStock: "Leather"
  },
  {
    identifier: "OI_012",
    name: "USB-C Docking Station",
    quantity: 12,
    unitPrice: 185.00,
    status: "pending",
    orderId: "ORD_002",
    approvers: ["director@innovate.com", "procurement.head@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/docking_station_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Desktop",
    color: "Silver",
    paperStock: "Aluminum"
  },
  // Additional items for ORD_005
  {
    identifier: "OI_013",
    name: "Antivirus Software",
    quantity: 100,
    unitPrice: 45.00,
    status: "approved",
    orderId: "ORD_005",
    approvers: ["procurement.head@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/antivirus_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Digital License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_014",
    name: "Project Management Tool",
    quantity: 50,
    unitPrice: 89.00,
    status: "approved",
    orderId: "ORD_005",
    approvers: ["director@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/project_mgmt_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Cloud License",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_010
  {
    identifier: "OI_015",
    name: "Enterprise Server",
    quantity: 3,
    unitPrice: 2500.00,
    status: "pending",
    orderId: "ORD_010",
    approvers: ["enterprise.manager@enterprisetech.com", "operations.manager@enterprisetech.com"],
    imageUrl: "https://cdn.example.com/proofs/server_proof.jpg",
    erpId: "ERP_SAP_03",
    size: "Rack Mount",
    color: "Black",
    paperStock: "Metal"
  },
  {
    identifier: "OI_016",
    name: "Network Switch",
    quantity: 8,
    unitPrice: 450.50,
    status: "pending",
    orderId: "ORD_010",
    approvers: ["enterprise.manager@enterprisetech.com"],
    imageUrl: "https://cdn.example.com/proofs/switch_proof.jpg",
    erpId: "ERP_SAP_03",
    size: "24-port",
    color: "Black",
    paperStock: "Metal"
  },
  {
    identifier: "OI_017",
    name: "UPS Battery Backup",
    quantity: 5,
    unitPrice: 320.00,
    status: "pending",
    orderId: "ORD_010",
    approvers: ["supply.chain.lead@enterprisetech.com"],
    imageUrl: "https://cdn.example.com/proofs/ups_proof.jpg",
    erpId: "ERP_SAP_03",
    size: "1500VA",
    color: "Black",
    paperStock: "Plastic"
  },
  // Items for ORD_011
  {
    identifier: "OI_018",
    name: "Vendor Management Software",
    quantity: 25,
    unitPrice: 120.00,
    status: "approved",
    orderId: "ORD_011",
    approvers: ["supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/vendor_mgmt_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "Cloud License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_019",
    name: "Contract Analysis Tool",
    quantity: 15,
    unitPrice: 80.00,
    status: "approved",
    orderId: "ORD_011",
    approvers: ["vendor.relations.head@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/contract_analysis_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "Cloud License",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_012
  {
    identifier: "OI_020",
    name: "APAC Specialized Equipment",
    quantity: 8,
    unitPrice: 890.00,
    status: "pending",
    orderId: "ORD_012",
    approvers: ["apac.director@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/apac_equipment_proof.jpg",
    erpId: "ERP_DYNAMICS_03",
    size: "Industrial",
    color: "Blue",
    paperStock: "Metal"
  },
  {
    identifier: "OI_021",
    name: "Regional Communication System",
    quantity: 12,
    unitPrice: 445.00,
    status: "pending",
    orderId: "ORD_012",
    approvers: ["apac.director@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/comm_system_proof.jpg",
    erpId: "ERP_DYNAMICS_03",
    size: "Desktop",
    color: "White",
    paperStock: "Plastic"
  },
  // Items for ORD_013
  {
    identifier: "OI_022",
    name: "Strategic Sourcing Platform License",
    quantity: 1,
    unitPrice: 8500.00,
    status: "approved",
    orderId: "ORD_013",
    approvers: ["strategic.head@innovate.com", "purchasing.vp@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/sourcing_platform_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Enterprise License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_023",
    name: "Training and Implementation",
    quantity: 1,
    unitPrice: 6700.00,
    status: "approved",
    orderId: "ORD_013",
    approvers: ["strategic.head@innovate.com"],
    imageUrl: "https://cdn.example.com/proofs/training_proof.jpg",
    erpId: "ERP_ORACLE_01",
    size: "Service Package",
    color: "N/A",
    paperStock: "Service"
  },
  // Items for ORD_014
  {
    identifier: "OI_024",
    name: "Office Furniture Set",
    quantity: 20,
    unitPrice: 285.50,
    status: "1",
    orderId: "ORD_014",
    approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"}],
    imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
    erpId: "ERP_SAP_05",
    size: "Standard Desk Set",
    color: "Oak Wood",
    paperStock: "Wood"
  },
  {
    identifier: "OI_025",
    name: "LED Lighting System",
    quantity: 15,
    unitPrice: 120.50,
    status: "shipped",
    orderId: "ORD_015",
    approvers: ["manager@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/lighting_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "Panel Light",
    color: "White",
    paperStock: "Aluminum"
  },
  // Items for ORD_015
  {
    identifier: "OI_026",
    name: "Process Automation Software",
    quantity: 10,
    unitPrice: 550.00,
    status: "pending",
    orderId: "ORD_015",
    approvers: ["operations.manager@enterprisetech.com"],
    imageUrl: "https://cdn.example.com/proofs/automation_proof.jpg",
    erpId: "ERP_SAP_03",
    size: "Enterprise License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_027",
    name: "Analytics Dashboard",
    quantity: 5,
    unitPrice: 450.00,
    status: "pending",
    orderId: "ORD_015",
    approvers: ["supply.chain.lead@enterprisetech.com"],
    imageUrl: "https://cdn.example.com/proofs/analytics_proof.jpg",
    erpId: "ERP_SAP_03",
    size: "Cloud License",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_016
  {
    identifier: "OI_028",
    name: "Startup Marketing Package",
    quantity: 1,
    unitPrice: 2500.00,
    status: "approved",
    orderId: "ORD_016",
    approvers: ["startup.supervisor@startuphub.com"],
    imageUrl: "https://cdn.example.com/proofs/marketing_package_proof.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "Service Package",
    color: "Mixed",
    paperStock: "Mixed"
  },
  {
    identifier: "OI_029",
    name: "Business Development Tools",
    quantity: 15,
    unitPrice: 157.67,
    status: "approved",
    orderId: "ORD_016",
    approvers: ["procurement.specialist.lead@startuphub.com"],
    imageUrl: "https://cdn.example.com/proofs/biz_dev_tools_proof.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "Software Suite",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_017
  {
    identifier: "OI_030",
    name: "Future Tech Hardware",
    quantity: 8,
    unitPrice: 950.00,
    status: "pending",
    orderId: "ORD_016",
    approvers: ["future.director@futuretech.com"],
    imageUrl: "https://cdn.example.com/proofs/future_tech_proof.jpg",
    erpId: "ERP_WORKDAY_01",
    size: "Advanced",
    color: "Silver",
    paperStock: "Carbon Fiber"
  },
  {
    identifier: "OI_031",
    name: "AI Development Platform",
    quantity: 3,
    unitPrice: 1600.00,
    status: "pending",
    orderId: "ORD_016",
    approvers: ["category.head@futuretech.com"],
    imageUrl: "https://cdn.example.com/proofs/ai_platform_proof.jpg",
    erpId: "ERP_WORKDAY_01",
    size: "Enterprise License",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_018
  {
    identifier: "OI_032",
    name: "Contract Management Suite",
    quantity: 1,
    unitPrice: 4500.00,
    status: "shipped",
    orderId: "ORD_016",
    approvers: ["contract.manager@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/contract_suite_proof.jpg",
    erpId: "ERP_DYNAMICS_02",
    size: "Enterprise License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_033",
    name: "Legal Compliance Module",
    quantity: 1,
    unitPrice: 2800.00,
    status: "shipped",
    orderId: "ORD_016",
    approvers: ["contract.supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/compliance_proof.jpg",
    erpId: "ERP_DYNAMICS_02",
    size: "Software Module",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_019
  {
    identifier: "OI_034",
    name: "Vendor Analytics Software",
    quantity: 12,
    unitPrice: 315.00,
    status: "approved",
    orderId: "ORD_016",
    approvers: ["analytics.head@techcorp.com"],
    imageUrl: "https://cdn.example.com/proofs/vendor_analytics_proof.jpg",
    erpId: "ERP_SAP_01",
    size: "Software License",
    color: "N/A",
    paperStock: "Digital"
  },
  // Items for ORD_020
  {
    identifier: "OI_035",
    name: "Performance Dashboard",
    quantity: 8,
    unitPrice: 190.00,
    status: "pending",
    orderId: "ORD_020",
    approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
    imageUrl: "https://cdn.pixabay.com/photo/2013/07/12/16/28/magazine-150960_1280.png",
    erpId: "ERP_ORACLE_03",
    size: "Cloud License",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_036",
    name: "Procurement Analysis Platform",
    quantity: 1,
    unitPrice: 3200.00,
    status: "pending",
    orderId: "ORD_020",
    approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
    imageUrl: "https://cdn.pixabay.com/photo/2013/07/12/16/28/magazine-150960_1280.png",
    erpId: "ERP_ORACLE_03",
    size: "Enterprise Platform",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_037",
    name: "Advanced Reporting Module",
    quantity: 1,
    unitPrice: 2050.00,
    status: "pending",
    orderId: "ORD_020",
    approvers: [{contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
    imageUrl: "https://cdn.pixabay.com/photo/2013/07/12/16/28/magazine-150960_1280.png",
    erpId: "ERP_ORACLE_03",
    size: "Software Module",
    color: "N/A",
    paperStock: "Digital"
  },
  {
    identifier: "OI_038",
    name: "Enterprise SSD",
    quantity: 10,
    unitPrice: 189.99,
    status: "delivered",
    orderId: "ORD_016",
    approvers: ["supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/ssd_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "2.5 inch",
    color: "Black",
    paperStock: "Matte"
  },
  {
    identifier: "OI_039",
    name: "Startup T-Shirts",
    quantity: 100,
    unitPrice: 15.00,
    status: "pending",
    orderId: "ORD_016",
    approvers: [{contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
    imageUrl: "https://cdn.example.com/proofs/tshirt_proof.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "M",
    color: "Blue",
    paperStock: "Cotton"
  },
  {
    identifier: "OI_040",
    name: "Enterprise SSD",
    quantity: 10,
    unitPrice: 189.99,
    status: "delivered",
    orderId: "ORD_018",
    approvers: ["supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/ssd_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "2.5 inch",
    color: "Black",
    paperStock: "Matte"
  },
  {
    identifier: "OI_041",
    name: "Startup T-Shirts",
    quantity: 100,
    unitPrice: 15.00,
    status: "pending",
    orderId: "ORD_019",
    approvers: [{contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
    imageUrl: "https://cdn.example.com/proofs/tshirt_proof.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "M",
    color: "Blue",
    paperStock: "Cotton"
  },
  {
    identifier: "OI_042",
    name: "Enterprise SSD",
    quantity: 10,
    unitPrice: 189.99,
    status: "delivered",
    orderId: "ORD_019",
    approvers: ["supervisor@globaltech.com"],
    imageUrl: "https://cdn.example.com/proofs/ssd_proof.jpg",
    erpId: "ERP_DYNAMICS_01",
    size: "2.5 inch",
    color: "Black",
    paperStock: "Matte"
  },
  {
    identifier: "OI_043",
    name: "Startup T-Shirts",
    quantity: 100,
    unitPrice: 15.00,
    status: "pending",
    orderId: "ORD_019",
    approvers: [{contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
    imageUrl: "https://cdn.example.com/proofs/tshirt_proof.jpg",
    erpId: "ERP_NETSUITE_01",
    size: "M",
    color: "Blue",
    paperStock: "Cotton"
  },
  {
          identifier: "OI_020_1",
          name: "Customized USB Drives",
          quantity: 250,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_020_1",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
          erpId: "ERP_SF_03",
          size: "32GB",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_020_2",
          name: "Branded Lanyards",
          quantity: 500,
          unitPrice: 2.00,
          status: "pending",
          orderId: "ORD_020_1",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2017/08/14/16/15/earphone-2640990_1280.jpg",
          erpId: "ERP_SF_03",
          size: "Standard",
          color: "Blue",
          paperStock: "N/A"
        },
		{
          identifier: "OI_020_3",
          name: "Wireless Keyboards",
          quantity: 10,
          unitPrice: 50.00,
          status: "pending",
          orderId: "ORD_020_2",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/07/14/16/19/desk-4337491_1280.jpg",
          erpId: "ERP_SF_03",
          size: "Standard",
          color: "Black",
          paperStock: "N/A"
        },
        {
          identifier: "OI_020_4",
          name: "Ergonomic Chairs",
          quantity: 2,
          unitPrice: 500.00,
          status: "pending",
          orderId: "ORD_020_2",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2025/08/28/05/57/robot-9801120_1280.jpg",
          erpId: "ERP_SF_03",
          size: "Large",
          color: "Grey",
          paperStock: "N/A"
        },
		{
          identifier: "OI_020_5",
          name: "Office Paper",
          quantity: 20,
          unitPrice: 5.00,
          status: "pending",
          orderId: "ORD_020_3",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2021/10/24/09/43/apple-watch-6737515_1280.jpg",
          erpId: "ERP_SF_03",
          size: "Letter",
          color: "White",
          paperStock: "Standard"
        },
        {
          identifier: "OI_020_6",
          name: "Staples",
          quantity: 5,
          unitPrice: 4.00,
          status: "pending",
          orderId: "ORD_020_3",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2018/02/16/02/03/pocket-watch-3156771_1280.jpg",
          erpId: "ERP_SF_03",
          size: "Standard",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_021_1",
          name: "Customized USB Drives",
          quantity: 250,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_021",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
          erpId: "ERP_SAP_05",
          size: "32GB",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_021_2",
          name: "Staples",
          quantity: 7,
          unitPrice: 4.00,
          status: "pending",
          orderId: "ORD_021",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2018/02/16/02/03/pocket-watch-3156771_1280.jpg",
          erpId: "ERP_SAP_05",
          size: "Standard",
          color: "Silver",
          paperStock: "N/A"
        },
		{
          identifier: "OI_021_3",
          name: "Office Paper",
          quantity: 25,
          unitPrice: 5.00,
          status: "pending",
          orderId: "ORD_021",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2021/10/24/09/43/apple-watch-6737515_1280.jpg",
          erpId: "ERP_SAP_05",
          size: "Letter",
          color: "White",
          paperStock: "Standard"
        },
        {
          identifier: "OI_022_1",
          name: "Office Paper",
          quantity: 25,
          unitPrice: 5.00,
          status: "pending",
          orderId: "ORD_022",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2021/10/24/09/43/apple-watch-6737515_1280.jpg",
          erpId: "ERP_SAP_05",
          size: "Letter",
          color: "White",
          paperStock: "Standard"
        },
        {
          identifier: "OI_032_1",
          name: "Customized USB Drives",
          quantity: 250,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_032",
          approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
          erpId: "ERP_ORACLE_03",
          size: "32GB",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_032_2",
          name: "Branded Lanyards",
          quantity: 500,
          unitPrice: 2.00,
          status: "pending",
          orderId: "ORD_032",
          approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2017/08/14/16/15/earphone-2640990_1280.jpg",
          erpId: "ERP_ORACLE_03",
          size: "Standard",
          color: "Blue",
          paperStock: "N/A"
        },
		{
          identifier: "OI_032_3",
          name: "Wireless Keyboards",
          quantity: 10,
          unitPrice: 50.00,
          status: "pending",
          orderId: "ORD_032",
          approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/07/14/16/19/desk-4337491_1280.jpg",
          erpId: "ERP_ORACLE_03",
          size: "Standard",
          color: "Black",
          paperStock: "N/A"
        },
        {
          identifier: "OI_033_1",
          name: "Customized USB Drives",
          quantity: 250,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_033",
          approvers: [{contactId: "CONT_021", email:"isabella.r@globalbiz.com", status:"0"}, 
                      {contactId: "999998", email:"udney.carvalho@axians.com", status:"0"},
                      {contactId: "CONT_006", email:"emily.davis@startuphub.com", status:"0"},
                      {contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
          erpId: "ERP_ORACLE_03",
          size: "32GB",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_018_1",
          name: "Customized USB Drives",
          quantity: 250,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_018",
          approvers: [{contactId: "CONT_022", email:"emily.roberts@vomelademo.com", status:"0"},
                      {contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2013/07/12/16/28/magazine-150960_1280.png",
          erpId: "ERP_SF_03",
          size: "32GB",
          color: "Silver",
          paperStock: "N/A"
        },
        {
          identifier: "OI_018_2",
          name: "Smartphone",
          quantity: 50,
          unitPrice: 10.00,
          status: "pending",
          orderId: "ORD_018",
          approvers: [{contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"0"}],
          imageUrl: "https://cdn.pixabay.com/photo/2019/09/02/15/43/smarthome-4447519_1280.jpg",
          erpId: "ERP_SF_03",
          size: "256GB",
          color: "Grey",
          paperStock: "N/A"
        },
        {
          identifier: "OI_017_1",
          name: "Branded Lanyards",
          quantity: 500,
          unitPrice: 2.00,
          status: "1",
          orderId: "ORD_017",
          approvers: [{contactId: "CONT_019", email:"sarah.collins@vomelademo.com", status:"1"}],
          imageUrl: "https://cdn.pixabay.com/photo/2017/08/14/16/15/earphone-2640990_1280.jpg",
          erpId: "ERP_ORACLE_03",
          size: "Standard",
          color: "Blue",
          paperStock: "N/A"
        }
];

// Shipments dummy data - Updated with new orders
// ======= SHIPMENTS DUMMY DATA =======
let shipments = [
  // Existing shipments
  {
    identifier: "SHIP_001",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS",
    shippedDate: "2024-01-20T14:30:00Z",
    estimatedDelivery: "2024-01-25T17:00:00Z",
    status: "shipped",
    deliveryAddress: "123 Tech Street, Innovation City, CA 90210",
    service: "UPS Ground",
    weight: 5.2,
    orderId: "ORD_001",
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SHIP_002",
    trackingNumber: "1234567890FEDEX",
    carrier: "FedEx",
    shippedDate: "2024-01-22T10:15:00Z",
    estimatedDelivery: "2024-01-26T14:30:00Z",
    status: "shipped",
    deliveryAddress: "456 Corporate Blvd, Business Park, NY 10001",
    service: "FedEx Express",
    weight: 12.8,
    orderId: "ORD_003",
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SHIP_003",
    trackingNumber: "DHL987654321",
    carrier: "DHL",
    shippedDate: "2024-01-24T08:45:00Z",
    estimatedDelivery: "2024-01-28T12:00:00Z",
    status: "shipped",
    deliveryAddress: "789 Enterprise Way, Commerce Center, TX 75001",
    service: "DHL Express",
    weight: 8.5,
    orderId: "ORD_004",
    erpId: "ERP_DYNAMICS_01"
  },
  {
    identifier: "SHIP_004",
    trackingNumber: "STHUB12345",
    carrier: "USPS",
    shippedDate: "2024-01-29T09:00:00Z",
    estimatedDelivery: "2024-02-02T15:00:00Z",
    status: "shipped",
    deliveryAddress: "987 Innovation Dr, Denver, CO",
    service: "Priority Mail",
    weight: 15.0,
    orderId: "ORD_006",
    erpId: "ERP_NETSUITE_01"
  },
  {
    identifier: "SHIP_005",
    trackingNumber: "ORACLE789456",
    carrier: "FedEx",
    shippedDate: "2024-02-03T11:00:00Z",
    estimatedDelivery: "2024-02-07T16:00:00Z",
    status: "shipped",
    deliveryAddress: "123 Main St, New York, NY",
    service: "FedEx Priority",
    weight: 2.1,
    orderId: "ORD_007",
    erpId: "ERP_ORACLE_02"
  },
  {
    identifier: "SHIP_006",
    trackingNumber: "EU123456789",
    carrier: "DPD",
    shippedDate: "2024-02-04T09:30:00Z",
    estimatedDelivery: "2024-02-08T14:00:00Z",
    status: "shipped",
    deliveryAddress: "321 Innovation Rd, Austin, TX",
    service: "DPD Express",
    weight: 18.5,
    orderId: "ORD_009",
    erpId: "ERP_DYNAMICS_02"
  },
  // Additional shipments
  {
    identifier: "SHIP_007",
    trackingNumber: "1Z999BB9876543210",
    carrier: "UPS",
    shippedDate: "2024-02-06T13:45:00Z",
    estimatedDelivery: "2024-02-11T17:00:00Z",
    status: "shipped",
    deliveryAddress: "456 Market Ave, San Francisco, CA",
    service: "UPS 2nd Day Air",
    weight: 25.3,
    orderId: "ORD_002",
    erpId: "ERP_ORACLE_01"
  },
  {
    identifier: "SHIP_008",
    trackingNumber: "SAP2SHIP456789",
    carrier: "FedEx",
    shippedDate: "2024-02-02T08:20:00Z",
    estimatedDelivery: "2024-02-05T12:00:00Z",
    status: "shipped",
    deliveryAddress: "456 Market Ave, San Francisco, CA",
    service: "FedEx Express",
    weight: 12.5,
    orderId: "ORD_008",
    erpId: "ERP_SAP_02"
  },
  {
    identifier: "SHIP_009",
    trackingNumber: "ENT123789456",
    carrier: "DHL",
    shippedDate: "2024-02-08T10:30:00Z",
    estimatedDelivery: "2024-02-13T15:30:00Z",
    status: "shipped",
    deliveryAddress: "159 Corporate Way, Phoenix, AZ",
    service: "DHL Express Worldwide",
    weight: 45.8,
    orderId: "ORD_010",
    erpId: "ERP_SAP_03"
  },
  {
    identifier: "SHIP_010",
    trackingNumber: "VENDOR456123",
    carrier: "UPS",
    shippedDate: "2024-02-09T14:15:00Z",
    estimatedDelivery: "2024-02-14T16:00:00Z",
    status: "shipped",
    deliveryAddress: "753 Technology Blvd, Portland, OR",
    service: "UPS Ground",
    weight: 8.2,
    orderId: "ORD_011",
    erpId: "ERP_DYNAMICS_01"
  },
  {
    identifier: "SHIP_011",
    trackingNumber: "APAC987654321",
    carrier: "DPD",
    shippedDate: "2024-02-10T11:45:00Z",
    estimatedDelivery: "2024-02-15T13:30:00Z",
    status: "shipped",
    deliveryAddress: "753 Technology Blvd, Portland, OR",
    service: "DPD Express",
    weight: 22.7,
    orderId: "ORD_012",
    erpId: "ERP_DYNAMICS_03"
  },
  {
    identifier: "SHIP_012",
    trackingNumber: "STRATEGIC789123",
    carrier: "FedEx",
    shippedDate: "2024-02-12T09:00:00Z",
    estimatedDelivery: "2024-02-16T14:00:00Z",
    status: "shipped",
    deliveryAddress: "246 Business Center Dr, Miami, FL",
    service: "FedEx Priority Overnight",
    weight: 3.5,
    orderId: "ORD_013",
    erpId: "ERP_ORACLE_01"
  },
  {
    identifier: "SHIP_013",
    trackingNumber: "RENOVATION456789",
    carrier: "UPS",
    shippedDate: "2024-02-14T15:20:00Z",
    estimatedDelivery: "2024-02-19T17:00:00Z",
    status: "shipped",
    deliveryAddress: "369 Industry Ave, Dallas, TX",
    service: "UPS 3 Day Select",
    weight: 35.4,
    orderId: "ORD_014",
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SHIP_014",
    trackingNumber: "OPS123456789",
    carrier: "DHL",
    shippedDate: "2024-02-16T12:30:00Z",
    estimatedDelivery: "2024-02-21T16:00:00Z",
    status: "shipped",
    deliveryAddress: "852 Commerce St, Atlanta, GA",
    service: "DHL Express",
    weight: 18.9,
    orderId: "ORD_015",
    erpId: "ERP_SAP_03"
  },
  {
    identifier: "SHIP_015",
    trackingNumber: "STARTUP789456",
    carrier: "USPS",
    shippedDate: "2024-02-17T10:45:00Z",
    estimatedDelivery: "2024-02-22T14:30:00Z",
    status: "shipped",
    deliveryAddress: "741 Startup Lane, Boulder, CO",
    service: "Priority Mail Express",
    weight: 12.3,
    orderId: "ORD_016",
    erpId: "ERP_NETSUITE_01"
  },
  {
        identifier: "SHIP_020_1",
        trackingNumber: "1Z999AA1234567891",
        carrier: "FedEx",
        shippedDate: "2024-03-05T16:30:00Z",
        estimatedDelivery: "2024-03-10T17:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "FedEx Ground",
        weight: 8.5,
        orderId: "ORD_020_1",
        erpId: "ERP_SF_03"
      },
	  {
        identifier: "SHIP_020_2",
        trackingNumber: "1Z999AA1234567892",
        carrier: "UPS",
        shippedDate: "2024-03-07T14:00:00Z",
        estimatedDelivery: "2024-03-12T17:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "UPS Ground",
        weight: 25.0,
        orderId: "ORD_020_2",
        erpId: "ERP_SF_03"
      },
	  {
        identifier: "SHIP_020_3",
        trackingNumber: "1Z999AA1234567893",
        carrier: "DHL",
        shippedDate: "2024-03-08T10:00:00Z",
        estimatedDelivery: "2024-03-13T12:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "DHL Express",
        weight: 5.0,
        orderId: "ORD_020_3",
        erpId: "ERP_SF_03"
      },
      {
        identifier: "SHIP_021",
        trackingNumber: "1Z999AA1234567890",
        carrier: "UPS",
        shippedDate: "2024-01-20T14:30:00Z",
        estimatedDelivery: "2024-01-25T17:00:00Z",
        status: "shipped",
        deliveryAddress: "123 Tech Street, Innovation City, CA 90210",
        service: "UPS Ground",
        weight: 5.2,
        orderId: "ORD_021",
        erpId: "ERP_SAP_05"
      },
      {
        identifier: "SHIP_022",
        trackingNumber: "1Z999AA1234567890",
        carrier: "UPS",
        shippedDate: "2024-01-20T14:30:00Z",
        estimatedDelivery: "2024-01-25T17:00:00Z",
        status: "shipped",
        deliveryAddress: "123 Tech Street, Innovation City, CA 90210",
        service: "UPS Ground",
        weight: 5.2,
        orderId: "ORD_022",
        erpId: "ERP_SAP_05"
      },
      {
        identifier: "SHIP_032",
        trackingNumber: "1Z999AA1234567890",
        carrier: "UPS",
        shippedDate: "2024-01-20T14:30:00Z",
        estimatedDelivery: "2024-01-25T17:00:00Z",
        status: "shipped",
        deliveryAddress: "123 Tech Street, Innovation City, CA 90210",
        service: "UPS Ground",
        weight: 5.2,
        orderId: "ORD_032",
        erpId: "ERP_ORACLE_03"
      },
      {
        identifier: "SHIP_033",
        trackingNumber: "1Z999AA1234567893",
        carrier: "DHL",
        shippedDate: "2024-03-08T10:00:00Z",
        estimatedDelivery: "2024-03-13T12:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "DHL Express",
        weight: 5.0,
        orderId: "ORD_033",
        erpId: "ERP_ORACLE_03"
      },
      {
        identifier: "SHIP_017",
        trackingNumber: "1Z999AA1234567893",
        carrier: "DHL",
        shippedDate: "2024-03-08T10:00:00Z",
        estimatedDelivery: "2024-03-13T12:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "DHL Express",
        weight: 5.0,
        orderId: "ORD_017",
        erpId: "ERP_ORACLE_03"
      },
      {
        identifier: "SHIP_018",
        trackingNumber: "1Z999AA1234567893",
        carrier: "DHL",
        shippedDate: "2024-03-08T10:00:00Z",
        estimatedDelivery: "2024-03-13T12:00:00Z",
        status: "shipped",
        deliveryAddress: "789 Global Plaza, Austin, TX",
        service: "DHL Express",
        weight: 5.0,
        orderId: "ORD_014",
        erpId: "ERP_SAP_05"
      }
];

// Shipment Items dummy data - Updated with new shipments
let shipmentItems = [
  {
    identifier: "SI_001",
    shipmentId: "SHIP_001",
    orderItemId: "OI_001",
    quantity: 25,
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SI_002",
    shipmentId: "SHIP_001",
    orderItemId: "OI_002",
    quantity: 12,
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SI_003",
    shipmentId: "SHIP_002",
    orderItemId: "OI_004",
    quantity: 30,
    erpId: "ERP_SAP_01"
  },
  {
    identifier: "SI_004",
    shipmentId: "SHIP_003",
    orderItemId: "OI_005",
    quantity: 10,
    erpId: "ERP_DYNAMICS_01"
  },
  {
    identifier: "SI_005",
    shipmentId: "SHIP_004",
    orderItemId: "OI_006",
    quantity: 100,
    erpId: "ERP_NETSUITE_01"
  },
  {
    identifier: "SI_006",
    shipmentId: "SHIP_005",
    orderItemId: "OI_007",
    quantity: 5,
    erpId: "ERP_ORACLE_02"
  },
  {
    identifier: "SI_007",
    shipmentId: "SHIP_006",
    orderItemId: "OI_009",
    quantity: 12,
    erpId: "ERP_DYNAMICS_02"
  }
];

// ======= HELPER FUNCTIONS =======

// Function to validate contact-ERP pairs
function validateContactErpPairs(pairs) {
  if (!Array.isArray(pairs)) {
    return { isValid: false, message: "Expected an array of contact-ERP pairs" };
  }
  
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (!pair.contactId || !pair.erpId) {
      return { 
        isValid: false, 
        message: `Invalid pair at index ${i}: contactId and erpId are required` 
      };
    }
  }
  
  return { isValid: true };
}

// Function to filter data based on contact-ERP pairs
function filterByContactErpPairs(data, pairs, contactIdField = 'contactId', erpIdField = 'erpId') {
  return data.filter(item => {
    return pairs.some(pair => 
      item[contactIdField] === pair.contactId && item[erpIdField] === pair.erpId
    );
  });
}

// ======= API ENDPOINTS =======

// Create contacts
app.post('/contacts/create', (req, res) => {
  try {
    const { contacts: newContacts } = req.body;
    
    if (!newContacts || !Array.isArray(newContacts)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contacts data. Expected an array."
      });
    }

    // Add new contacts to the array
    newContacts.forEach(contact => {
      const existingIndex = contacts.findIndex(
        c => c.contactId === contact.contactId && c.erpId === contact.erpId
      );
      
      if (existingIndex >= 0) {
        // Update existing contact
        contacts[existingIndex] = { ...contacts[existingIndex], ...contact };
      } else {
        // Add new contact
        contacts.push(contact);
      }
    });

    res.json({
      success: true,
      message: `${newContacts.length} contacts processed successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
});

// Get orders - Updated to accept array of contact-ERP pairs
app.post('/orders', (req, res) => {
  try {
    const { contactErpPairs } = req.body;
    
    if (!contactErpPairs) {
      return res.status(400).json({
        success: false,
        message: "contactErpPairs parameter is required in request body"
      });
    }

    const validation = validateContactErpPairs(contactErpPairs);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Filter orders based on contact-ERP pairs
    const filteredOrders = filterByContactErpPairs(orders, contactErpPairs);

    // Get unique ERPIds from the pairs for approvers filtering
    const uniqueErpIds = [...new Set(contactErpPairs.map(pair => pair.erpId))];

    // Map orders to include contacts and approvers
    const ordersWithDetails = filteredOrders.map(order => {
      // Find the contact for this specific order
      const orderContact = contacts.find(contact => 
        contact.contactId === order.contactId && contact.erpId === order.erpId
      );

      // Filter approvers for this order's ERP
      const orderApprovers = approvers.filter(approver => approver.erpId === order.erpId);

      return {
        ...order,
        contact: orderContact || null,
        approvers: orderApprovers
      };
    });

    res.json({
      orders: ordersWithDetails,
      metadata: {
        totalFound: ordersWithDetails.length,
        requestedPairs: contactErpPairs.length,
        uniqueErpIds: uniqueErpIds
      }
    });

  } catch (error) {
    console.error('Error in /orders endpoint:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get orders (legacy GET endpoint for backward compatibility)
app.get('/orders', (req, res) => {
  try {
    const { contactIds, erpId, orderId } = req.query;
    
    // erpIds é obrigatório
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    // Deve ter pelo menos contactIds ou orderId
    if (!contactIds && !orderId) {
      return res.status(400).json({
        success: false,
        message: "Either contactIds or orderId parameter is required"
      });
    }

    const erpIdArray = Array.isArray(erpId) ? erpId : [erpId];
    
    // Filter orders based on ERP IDs primeiro
    let filteredOrders = orders.filter(order => erpIdArray.includes(order.erpId));

    // Se orderId foi fornecido, filtra por ele
    if (orderId) {
      filteredOrders = filteredOrders.filter(order => order.identifier === orderId);
      
      // Se também foi fornecido contactIds, valida se o orderId está associado aos contactIds
      if (contactIds) {
        const contactIdArray = Array.isArray(contactIds) ? contactIds : [contactIds];
        filteredOrders = filteredOrders.filter(order => 
          contactIdArray.includes(order.contactId)
        );
      }
    } 
    // Se apenas contactIds foi fornecido (sem orderId)
    else if (contactIds) {
      const contactIdArray = Array.isArray(contactIds) ? contactIds : [contactIds];
      filteredOrders = filteredOrders.filter(order => 
        contactIdArray.includes(order.contactId)
      );
    }

    // Retorna apenas os campos desejados em formato de lista
    const simplifiedOrders = filteredOrders.map(order => ({
      id: order.identifier,
      contactId: order.contactId,
      status: order.status,
      CSR: order.CSRName,
      CSREmail: order.CSREmail,
      poNumber: order.poNumber || null,
      name: order.name,
      date: order.date,
      company: order.companyName
    }));

    res.json(simplifiedOrders);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get contacts by email - New endpoint to show multiple associations
app.get('/contacts/by-email/:email', (req, res) => {
  try {
    const { email } = req.params;
    
    const userContacts = contacts.filter(contact => 
      contact.email.toLowerCase() === email.toLowerCase()
    );

    if (userContacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found for this email"
      });
    }

    res.json({
      email: email,
      associations: userContacts,
      totalAssociations: userContacts.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get order items - NEW flexible endpoint (POST)
app.post('/orderItems', (req, res) => {
  try {
    const { filters } = req.body;
    
    if (!filters || !Array.isArray(filters)) {
      return res.status(400).json({
        success: false,
        message: "filters parameter is required and must be an array"
      });
    }

    // Validate filters
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (!filter.contactId || !filter.erpId) {
        return res.status(400).json({
          success: false,
          message: `Invalid filter at index ${i}: contactId and erpId are required`
        });
      }
    }

    let filteredItems = [];
    let filtersApplied = [];

    filters.forEach(filter => {
      let items;
      
      if (filter.orderId) {
        // Filter by specific orderId + contactId + erpId
        items = orderItems.filter(item => {
          // First find the order to validate contactId
          const order = orders.find(o => 
            o.identifier === filter.orderId && 
            o.contactId === filter.contactId && 
            o.erpId === filter.erpId
          );
          
          return order && item.orderId === filter.orderId && item.erpId === filter.erpId;
        });
        
        filtersApplied.push({
          type: 'specific_order',
          contactId: filter.contactId,
          erpId: filter.erpId,
          orderId: filter.orderId,
          itemsFound: items.length
        });
      } else {
        // Filter by contactId + erpId (all orders for this contact/erp)
        const contactOrders = orders.filter(order => 
          order.contactId === filter.contactId && order.erpId === filter.erpId
        );
        
        const orderIds = contactOrders.map(order => order.identifier);
        
        items = orderItems.filter(item => 
          orderIds.includes(item.orderId) && item.erpId === filter.erpId
        );
        
        filtersApplied.push({
          type: 'all_contact_orders',
          contactId: filter.contactId,
          erpId: filter.erpId,
          ordersFound: contactOrders.length,
          itemsFound: items.length
        });
      }
      
      filteredItems = [...filteredItems, ...items];
    });

    // Remove duplicates based on identifier
    const uniqueItems = filteredItems.filter((item, index, self) =>
      index === self.findIndex(i => i.identifier === item.identifier)
    );

    res.json({
      orderItems: uniqueItems,
      metadata: {
        totalFilters: filters.length,
        filtersApplied: filtersApplied,
        totalUniqueItems: uniqueItems.length,
        totalItemsBeforeDedup: filteredItems.length
      }
    });

  } catch (error) {
    console.error('Error in POST /orderItems:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get order items - Legacy endpoint (GET)
app.get('/orderItems', (req, res) => {
 try {
    const { orderId } = req.query;
    const { erpId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    const filteredItems = orderItems
      .filter(item => item.orderId === orderId && item.erpId === erpId)
      .map(item => ({
        erpId: item.erpId,
        id: item.identifier,  // renomeando identifier para id
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        unitPrice: item.unitPrice,
        orderId: item.orderId,
        /*approvers: item.approvers*/
      }));

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get('/proofs-by-item', (req, res) => {
  try {
    const { orderId, erpId, orderItemId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    // Filtra os items baseado nos parâmetros fornecidos
    let filteredItems = orderItems.filter(item => {
      let matches = item.erpId === erpId;
      
      if (orderId) {
        matches = matches && item.orderId === orderId;
      }
      
      if (orderItemId) {
        matches = matches && item.identifier === orderItemId;
      }
      
      return matches;
    });

    // Para cada item filtrado, gera os proofs baseado nos approvers
    const proofs = [];
    
    filteredItems.forEach(item => {
      if (item.approvers && Array.isArray(item.approvers)) {
        item.approvers.forEach(approver => {
          proofs.push({
            id: Math.floor(Math.random() * 100),
            contactId: approver.contactId,
            email: approver.email,
            status: approver.status,
            orderId: item.orderId,
            orderItemId: item.identifier
          });
        });
      }
    });

    res.json(proofs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.post('/proof-update', (req, res) => {
  try {
    const { erpId, orderId, orderItemId, contactId, status } = req.body;
    
    // Validate required parameters
    if (!erpId || !orderId || !orderItemId || !contactId || !status) {
      return res.status(400).json({
        success: false,
        message: "All parameters are required: erpId, orderId, orderItemId, contactId, status"
      });
    }

    // Find the specific order item
    const item = orderItems.find(item => 
      item.erpId === erpId && 
      item.orderId === orderId && 
      item.identifier === orderItemId
    );

    // Check if item exists
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found"
      });
    }

    // Find the specific approver within the item
    const approver = item.approvers?.find(app => app.contactId === contactId);

    // Check if approver exists
    if (!approver) {
      return res.status(404).json({
        success: false,
        message: "Approver not found for this order item"
      });
    }

    // Update the approver status
    approver.status = status;

    // Return success response with updated data
    res.json({
      success: true,
      message: "Approver status updated successfully",
      data: {
        erpId: item.erpId,
        orderId: item.orderId,
        orderItemId: item.identifier,
        contactId: approver.contactId,
        email: approver.email,
        status: approver.status
      }
    });

  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Serviço dummy
app.get("/orderItemAsset", async (req, res) => {
  try {
    const { ERPID, OrderId, OrderItemId, Type } = req.query;

    const orderItem = orderItems.find(
      (item) => item.identifier === OrderItemId && item.orderId === OrderId
    );

    if (!orderItem) {
      return res.status(404).json({ error: "OrderItem não encontrado" });
    }

    let fileUrl;

    if (Type === "jpg") {
      // Só aplica a lógica do orderItem se for jpg
      if (orderItem.imageUrl && orderItem.imageUrl.includes("pixabay")) {
        fileUrl = orderItem.imageUrl;
      } else {
        fileUrl =
          "https://cdn.pixabay.com/photo/2018/02/16/02/03/pocket-watch-3156771_1280.jpg";
      }
    } else {
      // Para PDF ou outros formatos
      fileUrl =
        "https://drive.usercontent.google.com/download?id=1gXl2oK9UJRni4O8dOm1qbXoNEEGX1ApJ&export=download&authuser=1&confirm=t&uuid=a87bbb66-8585-48c8-931d-03c9de57943a&at=AN8xHorygVDVJgBZZgk3Q7-yXRwh:1758572115769";
    }

    // URL dummy de exemplo
    /*let fileUrl =
      Type === "jpg"
        ? "https://cdn.pixabay.com/photo/2018/02/16/02/03/pocket-watch-3156771_1280.jpg"
        : "https://drive.usercontent.google.com/download?id=1gXl2oK9UJRni4O8dOm1qbXoNEEGX1ApJ&export=download&authuser=1&confirm=t&uuid=a87bbb66-8585-48c8-931d-03c9de57943a&at=AN8xHorygVDVJgBZZgk3Q7-yXRwh:1758572115769";
    */
    // Agente HTTPS que ignora SSL inválido (apenas para DEV)
    const agent = new https.Agent({ rejectUnauthorized: false });

    // Faz o download do arquivo como binário
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      httpsAgent: agent,
    });

    // Converte para base64
    const fileBase64 = Buffer.from(response.data, "binary").toString("base64");

    // Define contentType dinamicamente
    const contentType = Type === "jpg" ? "image/jpeg" : "application/pdf";

    // Retorna no formato solicitado
    res.json({
      contentType,
      encodedFile: fileBase64,
    });
  } catch (error) {
    console.error("Erro ao converter URL:", error.message);
    res.status(500).json({ error: "Falha ao converter arquivo para base64" });
  }
});


// Get shipments
app.get('/orders/:orderId/shipments', (req, res) => {
  try {
    const { orderId } = req.params;
    const { erpId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    const filteredShipments = shipments.filter(shipment => 
      shipment.orderId === orderId && shipment.erpId === erpId
    );

    res.json({
      shipments: filteredShipments,
      metadata: {
        orderId: orderId,
        erpId: erpId,
        totalShipments: filteredShipments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get shipment items
app.get('/shipments/:shipmentId/items', (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { erpId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    const filteredShipmentItems = shipmentItems.filter(item => 
      item.shipmentId === shipmentId && item.erpId === erpId
    );

    res.json({
      shipmentItems: filteredShipmentItems,
      metadata: {
        shipmentId: shipmentId,
        erpId: erpId,
        totalItems: filteredShipmentItems.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// PUT: Update order status
app.put('/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { erpId } = req.query;
    const { status } = req.body;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required in request body"
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`
      });
    }

    const orderIndex = orders.findIndex(order => 
      order.identifier === orderId && order.erpId === erpId
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    orders[orderIndex].status = status;

    res.json({
      success: true,
      message: `Order ${orderId} status updated to ${status}`,
      timestamp: new Date().toISOString(),
      order: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
});

// POST: Update order status
app.post('/updateOrder', (req, res) => {
  try {
    const { erpId, orderId, status } = req.body;

    // Validações
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId is required in request body"
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required in request body"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required in request body"
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`
      });
    }

    // Procura o pedido
    const orderIndex = orders.findIndex(order => 
      order.identifier === String(orderId) && order.erpId === erpId
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Atualiza status
    orders[orderIndex].status = status;

    res.json({
      success: true,
      message: `Order ${orderId} status updated to ${status}`,
      timestamp: new Date().toISOString(),
      order: orders[orderIndex]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
});


// PUT: Update proof status (commented out as proofs array was removed)
/*
app.put('/proofs/:proofId/status', (req, res) => {
  try {
    const { proofId } = req.params;
    const { erpId } = req.query;
    const { status } = req.body;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required in request body"
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`
      });
    }

    const proofIndex = proofs.findIndex(proof => 
      proof.identifier === proofId && proof.erpId === erpId
    );

    if (proofIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Proof not found"
      });
    }

    proofs[proofIndex].status = status;

    res.json({
      success: true,
      message: `Proof ${proofId} status updated to ${status}`,
      timestamp: new Date().toISOString(),
      proof: proofs[proofIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
});
*/

// PUT: Update orderItem status
app.put('/orderItems/:orderItemId/status', (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { erpId } = req.query;
    const { status } = req.body;

    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required in request body"
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`
      });
    }

    const orderItemIndex = orderItems.findIndex(orderItem => 
      orderItem.identifier === orderItemId && orderItem.erpId === erpId
    );

    if (orderItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "OrderItem not found"
      });
    }

    orderItems[orderItemIndex].status = status;

    res.json({
      success: true,
      message: `OrderItem ${orderItemId} status updated to ${status}`,
      timestamp: new Date().toISOString(),
      orderItem: orderItems[orderItemIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint (sem autenticação)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    auth: 'enabled',
    features: ['multiple-contact-erp-associations', 'enhanced-filtering']
  });
});

// Get all data (for debugging/development)
app.get('/debug/all-data', (req, res) => {
  res.json({
    contacts,
    orders,
    approvers,
    orderItems,
    shipments,
    shipmentItems,
    stats: {
      totalContacts: contacts.length,
      totalOrders: orders.length,
      totalOrderItems: orderItems.length,
      totalShipments: shipments.length,
      totalShipmentItems: shipmentItems.length,
      uniqueEmails: [...new Set(contacts.map(c => c.email))].length,
      uniqueErpIds: [...new Set(contacts.map(c => c.erpId))].length
    }
  });
});

// Get statistics about email associations
app.get('/debug/email-associations', (req, res) => {
  try {
    const emailGroups = {};
    
    contacts.forEach(contact => {
      if (!emailGroups[contact.email]) {
        emailGroups[contact.email] = [];
      }
      emailGroups[contact.email].push({
        contactId: contact.contactId,
        erpId: contact.erpId,
        name: contact.name,
        jobTitle: contact.jobTitle
      });
    });

    const multipleAssociations = Object.entries(emailGroups)
      .filter(([email, associations]) => associations.length > 1)
      .map(([email, associations]) => ({
        email,
        associations,
        count: associations.length
      }));

    res.json({
      totalEmails: Object.keys(emailGroups).length,
      emailsWithMultipleAssociations: multipleAssociations.length,
      multipleAssociations,
      allEmailGroups: emailGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Example endpoint to demonstrate usage
app.get('/examples/usage', (req, res) => {
  res.json({
    message: "API Usage Examples",
    examples: {
      "Get orders for specific contact-ERP pairs": {
        method: "POST",
        url: "/orders",
        body: {
          contactErpPairs: [
            { contactId: "CONT_001", erpId: "ERP_SAP_01" },
            { contactId: "CONT_007", erpId: "ERP_ORACLE_02" }
          ]
        }
      },
      "Get order items with flexible filtering": {
        method: "POST",
        url: "/orderItems",
        body: {
          filters: [
            { 
              contactId: "CONT_001", 
              erpId: "ERP_SAP_01", 
              orderId: "ORD_001",
              description: "Specific order items"
            },
            { 
              contactId: "CONT_002", 
              erpId: "ERP_ORACLE_01",
              description: "All order items for this contact/ERP (orderId is optional)"
            }
          ]
        }
      },
      "Get all associations for an email": {
        method: "GET",
        url: "/contacts/by-email/john.doe@techcorp.com"
      },
      "Get email association statistics": {
        method: "GET",
        url: "/debug/email-associations"
      },
      "Legacy orders endpoint (deprecated)": {
        method: "GET",
        url: "/orders?contactIds=CONT_001,CONT_002&erpIds=ERP_SAP_01,ERP_ORACLE_01",
        note: "Creates all possible combinations, less precise than POST /orders"
      },
      "Legacy order items endpoint": {
        method: "GET",
        url: "/orders/ORD_001/items?erpId=ERP_SAP_01",
        note: "Still available, but POST /orderItems offers more flexibility"
      }
    },
    notes: [
      "The same email can be associated with multiple contactId/erpId combinations",
      "Use POST /orders with contactErpPairs for precise filtering",
      "Use POST /orderItems for flexible item filtering with optional orderId",
      "GET /orders is maintained for backward compatibility but is less precise",
      "All endpoints require Basic Auth except /health"
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ERP Integration API Server v2.0 running on port ${PORT}`);
  console.log(`🔐 Basic Auth enabled - Username: ${AUTH_USERNAME}`);
  console.log(`📊 Loaded dummy data:`);
  console.log(`   - ${contacts.length} contacts`);
  console.log(`   - ${orders.length} orders`);
  console.log(`   - ${orderItems.length} order items`);
  console.log(`   - ${shipments.length} shipments`);
  console.log(`   - ${shipmentItems.length} shipment items`);
  
  // Show email association stats
  const emailGroups = {};
  contacts.forEach(contact => {
    if (!emailGroups[contact.email]) {
      emailGroups[contact.email] = 0;
    }
    emailGroups[contact.email]++;
  });
  
  const multipleAssociations = Object.entries(emailGroups)
    .filter(([email, count]) => count > 1).length;
    
  console.log(`   - ${Object.keys(emailGroups).length} unique emails`);
  console.log(`   - ${multipleAssociations} emails with multiple associations`);
  console.log(`🌐 API Documentation:`);
  console.log(`   - Health check: http://localhost:${PORT}/health`);
  console.log(`   - Debug data: http://localhost:${PORT}/debug/all-data`);
  console.log(`   - Usage examples: http://localhost:${PORT}/examples/usage`);
  console.log(`   - Email associations: http://localhost:${PORT}/debug/email-associations`);
});

module.exports = app;