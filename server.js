const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ======= DUMMY DATA (EXPANDED) =======

// Contacts dummy data
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
    name: "Jane Smith",
    email: "jane.smith@innovate.com",
    jobTitle: "Senior Buyer",
    phone: "+1-555-202-3002",
    contactId: "CONT_002",
    erpId: "ERP_ORACLE_01",
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

// Orders dummy data
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
  }
];

// Order Items dummy data
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
  }
];

// Shipments dummy data
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
  }
];

// Shipment Items dummy data
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
  }
];

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

// Get orders - Corrigido para incluir contatos e aprovadores em cada pedido
app.get('/orders', (req, res) => {
  try {
    const { contactIds, erpIds } = req.query;
    
    if (!contactIds || !erpIds) {
      return res.status(400).json({
        success: false,
        message: "contactIds and erpIds parameters are required"
      });
    }

    const contactIdArray = Array.isArray(contactIds) ? contactIds : [contactIds];
    const erpIdArray = Array.isArray(erpIds) ? erpIds : [erpIds];
    
    // Filtrar os pedidos com base nos erpIds
    const filteredOrders = orders.filter(order => erpIdArray.includes(order.erpId));

    // Mapear os pedidos para incluir os contatos e aprovadores aninhados
    const ordersWithDetails = filteredOrders.map(order => {
        // Encontrar o contato principal da ordem
        const orderContact = contacts.find(contact => 
            contact.contactId === order.contactId && contact.erpId === order.erpId
        );

        // Filtrar os aprovadores para o erpId da ordem atual
        const orderApprovers = approvers.filter(approver => approver.erpId === order.erpId);

        return {
            ...order,
            contact: orderContact || null, // Adiciona o objeto de contato aninhado
            approvers: orderApprovers // Adiciona a lista de aprovadores aninhada
        };
    });

    res.json({
      orders: ordersWithDetails,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get order items
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

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get proofs by order item
/*
app.get('/order-items/:orderItemId/proofs', (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { erpId } = req.query;
    
    if (!erpId) {
      return res.status(400).json({
        success: false,
        message: "erpId parameter is required"
      });
    }

    const filteredProofs = proofs.filter(proof => 
      proof.orderItemId === orderItemId && proof.erpId === erpId
    );

    res.json(filteredProofs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});*/

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

    res.json(filteredShipments);
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

    res.json(filteredShipmentItems);
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

// PUT: Update proof status
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


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all data (for debugging/development)
app.get('/debug/all-data', (req, res) => {
  res.json({
    contacts,
    orders,
    approvers,
    orderItems,
    proofs,
    shipments,
    shipmentItems,
    stats: {
      totalContacts: contacts.length,
      totalOrders: orders.length,
      totalOrderItems: orderItems.length,
      totalProofs: proofs.length,
      totalShipments: shipments.length,
      totalShipmentItems: shipmentItems.length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ERP Integration API Server running on port ${PORT}`);
  console.log(`📊 Loaded dummy data:`);
  console.log(`   - ${contacts.length} contacts`);
  console.log(`   - ${orders.length} orders`);
  console.log(`   - ${orderItems.length} order items`);
  /*console.log(`   - ${proofs.length} proofs`);*/
  console.log(`   - ${shipments.length} shipments`);
  console.log(`   - ${shipmentItems.length} shipment items`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}/health`);
  console.log(`🔧 Debug endpoint: http://localhost:${PORT}/debug/all-data`);
});

module.exports = app;
