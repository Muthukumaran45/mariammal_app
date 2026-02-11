export const bannerImg = [
  "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg",
  "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174884/img2_pgsber.jpg",
  "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174884/img1_zc1qkv.jpg",
  "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174874/img5_nxxq8e.jpg",
  "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174884/img2_pgsber.jpg",
];

export const products = [
  {
    "id": "1",
    "name": "Tree Top Mango",
    "quantity": "15 bottle",
    "price": "₹880",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg"
  },
  {
    "id": "2",
    "name": "Veg Mayonnaise",
    "quantity": "15 bottle",
    "price": "₹925",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174874/img5_nxxq8e.jpg"
  },
  {
    "id": "3",
    "name": "Tree Top Mango",
    "quantity": "15 bottle",
    "price": "₹880",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg"
  },
  {
    "id": "4",
    "name": "Veg Mayonnaise",
    "quantity": "15 bottle",
    "price": "₹925",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174874/img5_nxxq8e.jpg"
  },
  {
    "id": "5",
    "name": "Veg Mayonnaise",
    "quantity": "15 bottle",
    "price": "₹925",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174874/img5_nxxq8e.jpg"
  },
  {
    "id": "6",
    "name": "Tree Top Mango",
    "quantity": "15 bottle",
    "price": "₹880",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg"
  }, {
    "id": "7",
    "name": "Tree Top Mango",
    "quantity": "15 bottle",
    "price": "₹880",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg"
  },
  {
    "id": "8",
    "name": "Veg Mayonnaise",
    "quantity": "15 bottle",
    "price": "₹925",
    "image": "https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174874/img5_nxxq8e.jpg"
  },
]

export const offers_data = [
  {
    id: '1',
    name: 'Tomatoes',
    price: '₹40/kg',
    image: 'https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg',
  },
  {
    id: '2',
    name: 'Salad',
    price: '₹120/plate',
    image: 'https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg',
  },
  {
    id: '3',
    name: 'Vegetables',
    price: '₹80/basket',
    image: 'https://res.cloudinary.com/ddjgg4ecg/image/upload/v1739174881/img4_qt8b36.jpg',
  },
];

export const onboardingData = [
  { id: 1, image: require("../../assets/img1.jpg") },
  { id: 2, image: require("../../assets/img3.jpg") },
  { id: 3, image: require("../../assets/img1.jpg") },
];



// admin data
export const mockProducts = [
  {
    id: 1,
    name: 'Organic Bananas',
    category: 'Fruits',
    price: '$2.99',
    stock: 45,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Whole Milk',
    category: 'Dairy',
    price: '$3.49',
    stock: 8,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Sourdough Bread',
    category: 'Bakery',
    price: '$4.99',
    stock: 0,
    status: 'Out of Stock',
  },
  {
    id: 4,
    name: 'Free-Range Eggs',
    category: 'Dairy',
    price: '$5.99',
    stock: 23,
    status: 'Active',
  },
];

export const mockOrders = [
  {
    id: '#3210',
    customer: 'John Doe',
    email: 'john@example.com',
    status: 'Completed',
    items: '5 items',
    amount: '$89.99',
    date: '2024-01-15',
  },
  {
    id: '#3209',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Processing',
    items: '8 items',
    amount: '$156.50',
    date: '2024-01-15',
  },
  {
    id: '#3208',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'Shipped',
    items: '3 items',
    amount: '$67.25',
    date: '2024-01-14',
  },
];

export const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    orders: 12,
    totalSpent: '$1,234.56',
    status: 'Active',
    joinDate: '2023-06-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    orders: 8,
    totalSpent: '$892.30',
    status: 'Active',
    joinDate: '2023-08-22',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    orders: 3,
    totalSpent: '$156.78',
    status: 'Inactive',
    joinDate: '2023-12-01',
  },
];


// home data
export const weeklyDeals = [
  {
    id: 1,
    name: 'Chicken Breast',
    price: 9.99,
    originalPrice: 12.99,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300&auto=format',
    discount: 23,
    daysLeft: 3,
  },
  {
    id: 2,
    name: 'Salmon Fillet',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=300&auto=format',
    discount: 20,
    daysLeft: 5,
  },
];


export const quickActions = [
  { id: 1, name: 'My Orders', icon: 'receipt-outline', color: '#4CAD73' },
  { id: 2, name: 'Favorites', icon: 'heart-outline', color: '#FF5722' },
  { id: 3, name: 'Support', icon: 'help-circle-outline', color: '#9C27B0' },
];

export const featuredOffers = [
  {
    id: 1,
    title: 'Fresh Produce Sale',
    subtitle: 'Up to 30% off on fruits & vegetables',
    description: 'Get the freshest produce at unbeatable prices',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format',
    discount: '30%',
    validUntil: 'Valid until Dec 31',
  },
  {
    id: 2,
    title: 'Dairy Special',
    subtitle: 'Buy 2 Get 1 Free on selected items',
    description: 'Premium dairy products with amazing deals',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=400&auto=format',
    discount: 'B2G1',
    validUntil: 'Limited time',
  },
  {
    id: 3,
    title: 'Weekend Special',
    subtitle: 'Extra 20% off on all bakery items',
    description: 'Fresh baked goods every morning',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=400&auto=format',
    discount: '20%',
    validUntil: 'This weekend only',
  },
];

export const bestSellingProducts = [
  {
    id: 1,
    name: 'Fresh Organic Bananas',
    price: 2.99,
    originalPrice: 3.49,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=300&auto=format',
    rating: 4.8,
    discount: 15,
    unit: 'per kg',
    inStock: true,
  },
  {
    id: 2,
    name: 'Premium Whole Milk',
    price: 4.29,
    originalPrice: 4.29,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=300&auto=format',
    rating: 4.9,
    discount: 0,
    unit: 'per liter',
    inStock: true,
  },
  {
    id: 3,
    name: 'Fresh Beef Steak',
    price: 12.99,
    originalPrice: 15.99,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=300&auto=format',
    rating: 4.7,
    discount: 20,
    unit: 'per kg',
    inStock: true,
  },
  {
    id: 4,
    name: 'Artisan Bread',
    price: 3.49,
    originalPrice: 3.49,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=300&auto=format',
    rating: 4.6,
    discount: 0,
    unit: 'per piece',
    inStock: false,
  },
];

export const categories = [
  {
    id: 1,
    name: "All",
    icon: "🥕",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345894/2305.i309.032.S.m004.c13.paper_bag_vegetables_realistic_composition_pres2s.jpg",
    itemCount: 156,
    screen: "AllProducts",
    category: "All",
  },
  {
    id: 2,
    name: "Cigarette",
    icon: "🚬",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345895/6981_zde0qb.jpg",
    itemCount: 89,
    screen: "AllProducts",
    category: "Cigarette",
  },
  {
    id: 3,
    name: "Daily Essentials",
    icon: "🛒",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345854/top-view-eco-friendly-cleaning-products-with-baking-soda_xdcdj9.jpg",
    itemCount: 67,
    screen: "AllProducts",
    category: "Daily Essentials",
  },
  {
    id: 4,
    name: "Personal Care",
    icon: "🧴",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345877/decoration-with-soap-oils-bathing_lgzcek.jpg",
    itemCount: 45,
    screen: "AllProducts",
    category: "Personal Care",
  },
  {
    id: 5,
    name: "Snacks",
    icon: "🍿",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345895/423197-PE6QPM-300_safcco.jpg",
    itemCount: 234,
    screen: "AllProducts",
    category: "Snacks",
  },
  {
    id: 6,
    name: "Juice",
    icon: "🧃",
    image: "https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345901/OR7TJT0_lj0mxc.jpg",
    itemCount: 78,
    screen: "AllProducts",
    category: "Juice",
  },
]

