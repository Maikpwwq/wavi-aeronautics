export const MOCK_ORDERS = [
  {
    id: 'ORD-7829-XJ',
    items: [
      { name: 'DJI Mavic 3 Cine Premium Combo', quantity: 1, price: 4999 }
    ],
    total: 4999,
    status: 'Delivered',
    createdAt: { seconds: Date.now() / 1000 - 86400 * 5 } // 5 days ago
  },
  {
    id: 'ORD-9921-MC',
    items: [
      { name: 'FPV Propellers (Set of 4)', quantity: 2, price: 15 },
      { name: 'LiPo Battery 4S 1500mAh', quantity: 3, price: 25 }
    ],
    total: 105,
    status: 'Shipped',
    createdAt: { seconds: Date.now() / 1000 - 86400 * 1 } // 1 day ago
  }
];
