const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const { v4: uuidv4 } = require('uuid');

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
  }
];

// Orders dummy data - Updated with more varied associations
let orders = [
  {
    identifier: "ORD_001",
    name: "Office Supplies Q1",
    date: "2024-01-15T10:30:00Z",
    status: "approved",
    total: 2850.75,
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
    total: 15750.00,
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
    total: 1200.50,
    erpId: "ERP_SAP_01",
    contactId: "CONT_003",
    CSREmail: "Sarah@gmail.com",
    CSRName: "Sarah Costa",
    companyName: "TechCorp"
  },
  {
    identifier: "ORD_004",
    name: "Facility Maintenance",
    date: "2024-01-22T16:45:00Z",
    status: "delivered",
    total: 3400.25,
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
    total: 2500.00,
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
    contactId: "CONT_007", // John Doe in different ERP
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
    contactId: "CONT_008", // Jane Smith in different contact/ERP
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
    contactId: "CONT_004", // Sarah Wilson in different ERP
    CSREmail: "eu.csr@gmail.com",
    CSRName: "EU CSR",
    companyName: "GlobalTech EU"
  }
];

// Approvers dummy data - Updated with more ERP associations
let approvers = [
  { email: "manager@techcorp.com", erpId: "ERP_SAP_01", role: "Manager" },
  { email: "director@innovate.com", erpId: "ERP_ORACLE_01", role: "Director" },
  { email: "supervisor@globaltech.com", erpId: "ERP_DYNAMICS_01", role: "Supervisor" },
  { email: "admin@techcorp.com", erpId: "ERP_SAP_01", role: "Administrator" },
  { email: "procurement.head@innovate.com", erpId: "ERP_ORACLE_01", role: "Procurement Head" },
  { email: "oracle.manager@techcorp.com", erpId: "ERP_ORACLE_02", role: "Oracle Manager" },
  { email: "sap2.director@innovate.com", erpId: "ERP_SAP_02", role: "SAP2 Director" },
  { email: "eu.supervisor@globaltech.com", erpId: "ERP_DYNAMICS_02", role: "EU Supervisor" }
];

// Order Items dummy data - Updated with new order associations
let orderItems = [
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
    imageUrl: "https://cdn.example.com/proofs/tshirt_proof.jpg",
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
  }
];

// Shipments dummy data - Updated with new orders
let shipments = [
  {
    identifier: "SHIP_001",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS",
    shippedDate: "2024-01-20T14:30:00Z",
    estimatedDelivery: "2024-01-25T17:00:00Z",
    status: "in_transit",
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
    status: "delivered",
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
    status: "preparing",
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
    status: "pending",
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
    status: "in_transit",
    deliveryAddress: "321 Innovation Rd, Austin, TX",
    service: "DPD Express",
    weight: 18.5,
    orderId: "ORD_009",
    erpId: "ERP_DYNAMICS_02"
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
    const { contactIds, erpIds } = req.query;
    
    if (!contactIds || !erpIds) {
      return res.status(400).json({
        success: false,
        message: "contactIds and erpIds parameters are required. Consider using POST /orders with contactErpPairs for better control."
      });
    }

    const contactIdArray = Array.isArray(contactIds) ? contactIds : [contactIds];
    const erpIdArray = Array.isArray(erpIds) ? erpIds : [erpIds];
    
    // Create all possible combinations (legacy behavior)
    const contactErpPairs = [];
    contactIdArray.forEach(contactId => {
      erpIdArray.forEach(erpId => {
        contactErpPairs.push({ contactId, erpId });
      });
    });

    // Filter orders based on ERP IDs (legacy behavior - less precise)
    const filteredOrders = orders.filter(order => erpIdArray.includes(order.erpId));

    const ordersWithDetails = filteredOrders.map(order => {
      const orderContact = contacts.find(contact => 
        contact.contactId === order.contactId && contact.erpId === order.erpId
      );
      const orderApprovers = approvers.filter(approver => approver.erpId === order.erpId);

      return {
        ...order,
        contact: orderContact || null,
        approvers: orderApprovers
      };
    });

    res.json({
      orders: ordersWithDetails,
      warning: "This endpoint is deprecated. Use POST /orders with contactErpPairs for precise filtering."
    });

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
app.get('/orders/:orderId/items', (req, res) => {
  try {
    const { orderId } = req.params;
    const { erpId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    const filteredItems = orderItems.filter(item => 
      item.orderId === orderId && item.erpId === erpId
    );

    res.json({
      orderItems: filteredItems,
      metadata: {
        orderId: orderId,
        erpId: erpId,
        totalItems: filteredItems.length
      },
      note: "Consider using POST /orderItems for more flexible filtering"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
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