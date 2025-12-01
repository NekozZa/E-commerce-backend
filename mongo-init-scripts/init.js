db = db.getSiblingDB("products");

let products = [
  {
    _id: ObjectId("6921794fd37aef91e9063b97"),
    name: "Intel i5 12400F",
    brand: "Intel",
    price: 3800000,
    inventory: 10,
    images: [
      "http://localhost:3000/uploads/intel-corei5-12400F_1.jpg",
      "http://localhost:3000/uploads/intel-corei5-12400F_2.jpg",
      "http://localhost:3000/uploads/intel-corei5-12400F_3.jpg",
    ],
    productType: "Component",
    componentType: "cpu",
    specs: { socket: "LGA1700", cores: 6, threads: 12 },
    createdAt: ISODate("2025-11-22T08:50:23.008Z"),
    updatedAt: ISODate("2025-11-29T04:37:54.537Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6922c705c9e0de915584a818"),
    name: "Intel Core i7-12700K",
    brand: "Intel",
    price: 9500000,
    inventory: 20,
    images: [
      "http://localhost:3000/uploads/intel-corei7-12700K_1.jpg",
      "http://localhost:3000/uploads/intel-corei7-12700K_2.jpg",
      "http://localhost:3000/uploads/intel-corei7-12700K_3.jpg",
    ],
    description: "CPU mạnh cho gaming và làm việc",
    productType: "Component",
    componentType: "cpu",
    specs: {
      cores: 12,
      threads: 20,
      baseClock: "3.6GHz",
      boostClock: "5.0GHz",
      tdp: "125W",
    },
    createdAt: ISODate("2025-11-23T08:34:13.048Z"),
    updatedAt: ISODate("2025-11-29T04:38:55.829Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6922c71ac9e0de915584a81a"),
    name: "Samsung 980 1TB NVMe",
    brand: "Samsung",
    price: 2500000,
    inventory: 30,
    images: [
      "http://localhost:3000/uploads/samsung980_1.jpg",
      "http://localhost:3000/uploads/samsung980_2.jpg",
      "http://localhost:3000/uploads/samsung980_3.jpg",
    ],
    description: "SSD NVMe 1TB tốc độ cao",
    productType: "Component",
    componentType: "ssd",
    specs: {
      capacity: "1TB",
      interface: "NVMe",
      readSpeed: "3500MB/s",
      writeSpeed: "3000MB/s",
    },
    createdAt: ISODate("2025-11-23T08:34:34.758Z"),
    updatedAt: ISODate("2025-11-29T04:41:53.897Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e94123c33dfcf314142d"),
    name: "Kingston Fury Beast 16GB DDR4",
    brand: "Kingston",
    price: 900000,
    inventory: 100,
    images: [
      "http://localhost:3000/uploads/furybeast16gb_1.jpg",
      "http://localhost:3000/uploads/furybeast16gb_2.jpg",
      "http://localhost:3000/uploads/furybeast16gb_3.jpg",
    ],
    description: "RAM DDR4 16GB bus 3200MHz.",
    productType: "Component",
    componentType: "ram",
    specs: { capacity: "16GB", type: "DDR4", speed: "3200MHz" },
    createdAt: ISODate("2025-11-24T05:12:33.283Z"),
    updatedAt: ISODate("2025-11-29T04:54:42.954Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e95123c33dfcf314142f"),
    name: "ASUS Prime B660M-A",
    brand: "ASUS",
    price: 2200000,
    inventory: 40,
    images: [
      "http://localhost:3000/uploads/B660M_1.jpg",
      "http://localhost:3000/uploads/B660M_2.jpg",
      "http://localhost:3000/uploads/B660M_3.jpg",
    ],
    description: "Mainboard hỗ trợ Intel thế hệ 12.",
    productType: "Component",
    componentType: "mainboard",
    specs: {
      socket: "LGA1700",
      chipset: "B660",
      formFactor: "mATX",
      memorySupport: "DDR4",
    },
    createdAt: ISODate("2025-11-24T05:12:49.156Z"),
    updatedAt: ISODate("2025-11-29T04:52:59.801Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e95923c33dfcf3141431"),
    name: "Cooler Master MWE 650W",
    brand: "Cooler Master",
    price: 1200000,
    inventory: 60,
    images: [
      "http://localhost:3000/uploads/mwe_1.jpg",
      "http://localhost:3000/uploads/mwe_2.jpg",
      "http://localhost:3000/uploads/mwe_3.jpg",
    ],
    description: "Nguồn công suất 650W chuẩn 80 Plus Bronze.",
    productType: "Component",
    componentType: "psu",
    specs: {
      wattage: "650W",
      efficiency: "80 Plus Bronze",
      modular: "Non-modular",
    },
    createdAt: ISODate("2025-11-24T05:12:57.430Z"),
    updatedAt: ISODate("2025-11-29T04:53:57.043Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e96123c33dfcf3141433"),
    name: "Xigmatek Aqua",
    brand: "Xigmatek",
    price: 750000,
    inventory: 45,
    images: [
      "http://localhost:3000/uploads/AquaCase_1.jpg",
      "http://localhost:3000/uploads/AquaCase_2.jpg",
      "http://localhost:3000/uploads/AquaCase_3.jpg",
    ],
    description: "Case ATX thiết kế đẹp, airflow tốt.",
    productType: "Component",
    componentType: "case",
    specs: {
      formFactor: "ATX",
      sidePanel: "Tempered Glass",
      fanSupport: "120mm / 140mm",
    },
    createdAt: ISODate("2025-11-24T05:13:05.649Z"),
    updatedAt: ISODate("2025-11-29T04:55:34.836Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e96923c33dfcf3141435"),
    name: "Deepcool AG400",
    brand: "Deepcool",
    price: 450000,
    inventory: 80,
    images: [
      "http://localhost:3000/uploads/ag400_1.jpg",
      "http://localhost:3000/uploads/ag400_2.jpg",
      "http://localhost:3000/uploads/ag400_3.jpg",
    ],
    description: "Tản khí 1 fan hiệu quả cho CPU tầm trung.",
    productType: "Component",
    componentType: "cooler",
    specs: {
      type: "Air Cooling",
      fanSize: "120mm",
      height: "155mm",
      socketSupport: ["LGA1700", "AM4"],
    },
    createdAt: ISODate("2025-11-24T05:13:13.427Z"),
    updatedAt: ISODate("2025-11-29T04:57:04.110Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923e97423c33dfcf3141437"),
    name: "NVIDIA RTX 3060 12GB",
    brand: "NVIDIA",
    price: 7500000,
    inventory: 25,
    images: [
      "http://localhost:3000/uploads/rtx3060_1.jpg",
      "http://localhost:3000/uploads/rtx3060_2.jpg",
      "http://localhost:3000/uploads/rtx3060_3.jpg",
    ],
    description: "Card đồ họa RTX 3060 hiệu năng cao.",
    productType: "Component",
    componentType: "vga",
    specs: {
      memory: "12GB GDDR6",
      boostClock: "1777MHz",
      powerConsumption: "170W",
    },
    createdAt: ISODate("2025-11-24T05:13:24.961Z"),
    updatedAt: ISODate("2025-11-29T04:57:58.769Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923f4ed390a789470182ea2"),
    name: "Corsair Vengeance LPX 16GB (2x8) 3200MHz",
    brand: "Corsair",
    price: 1350000,
    inventory: 50,
    images: [
      "http://localhost:3000/uploads/lpx16gb_1.jpg",
      "http://localhost:3000/uploads/lpx16gb_2.jpg",
      "http://localhost:3000/uploads/lpx16gb_3.jpg",
    ],
    description: "RAM Corsair LPX bus 3200MHz phổ biến cho gaming.",
    productType: "Component",
    componentType: "ram",
    specs: { capacity: "16GB", bus: "3200MHz", type: "DDR4", module: "2x8GB" },
    createdAt: ISODate("2025-11-24T06:02:21.852Z"),
    updatedAt: ISODate("2025-11-29T04:59:03.898Z"),
    __v: 0,
  },
  {
    _id: ObjectId("6923f523390a789470182ea5"),
    name: "MSI B660M Mortar WiFi DDR4",
    brand: "MSI",
    price: 3300000,
    inventory: 30,
    images: [
      "http://localhost:3000/uploads/motar_1.jpg",
      "http://localhost:3000/uploads/motar_2.jpg",
      "http://localhost:3000/uploads/motar_3.jpg",
    ],
    description: "Mainboard MSI B660M Mortar WiFi hỗ trợ Intel 12th.",
    productType: "Component",
    componentType: "mainboard",
    specs: {
      socket: "LGA1700",
      formFactor: "mATX",
      ramSupport: "DDR4",
      wifi: true,
    },
    createdAt: ISODate("2025-11-24T06:03:15.956Z"),
    updatedAt: ISODate("2025-11-29T05:01:10.790Z"),
    __v: 0,
  },
  {
    _id: ObjectId("692a7ef21ac548f195b3f086"),
    name: "PC Gaming i5 2024",
    brand: "Custom",
    inventory: 10,
    images: [
      "http://localhost:3000/uploads/pcgaming_1.jpg",
      "http://localhost:3000/uploads/pcgaming_2.jpg",
      "http://localhost:3000/uploads/pcgaming_3.jpg",
    ],
    description: "PC gaming tầm trung sử dụng i5 12400F.",
    productType: "Computer",
    baseName: "PC Gaming i5",
    variantId: null,
    components: [
      ObjectId("6921794fd37aef91e9063b97"),
      ObjectId("6922c71ac9e0de915584a81a"),
      ObjectId("6923e94123c33dfcf314142d"),
      ObjectId("6923e95123c33dfcf314142f"),
      ObjectId("6923e95923c33dfcf3141431"),
      ObjectId("6923e96123c33dfcf3141433"),
      ObjectId("6923e96923c33dfcf3141435"),
      ObjectId("6923e97423c33dfcf3141437"),
    ],
    totalPrice: 19300000,
    variants: [
      {
        name: "PC Gaming i5 2024 - cpu + ram",
        overrides: [
          ObjectId("6921794fd37aef91e9063b97"),
          ObjectId("6923f4ed390a789470182ea2"),
        ],
        totalPrice: 19750000,
        _id: ObjectId("692a7ef21ac548f195b3f095"),
      },
      {
        name: "PC Gaming i5 2024 - cpu + ram",
        overrides: [
          ObjectId("6922c705c9e0de915584a818"),
          ObjectId("6923e94123c33dfcf314142d"),
        ],
        totalPrice: 25000000,
        _id: ObjectId("692a7ef21ac548f195b3f09e"),
      },
      {
        name: "PC Gaming i5 2024 - cpu + ram",
        overrides: [
          ObjectId("6922c705c9e0de915584a818"),
          ObjectId("6923f4ed390a789470182ea2"),
        ],
        totalPrice: 25450000,
        _id: ObjectId("692a7ef21ac548f195b3f0a7"),
      },
    ],
    optionGroups: [],
    changed: [],
    createdAt: ISODate("2025-11-29T05:04:50.033Z"),
    updatedAt: ISODate("2025-11-29T05:04:50.162Z"),
    __v: 1,
  },
  {
    _id: ObjectId("692a7ef21ac548f195b3f091"),
    name: "PC Gaming i5 2024 - cpu + ram",
    brand: "Custom",
    inventory: 10,
    images: [
      "http://localhost:3000/uploads/pcgaming_1.jpg",
      "http://localhost:3000/uploads/pcgaming_2.jpg",
      "http://localhost:3000/uploads/pcgaming_3.jpg",
    ],
    description: "PC gaming tầm trung sử dụng i5 12400F.",
    productType: "Computer",
    baseName: "PC Gaming i5",
    variantId: ObjectId("692a7ef21ac548f195b3f086"),
    components: [
      ObjectId("6921794fd37aef91e9063b97"),
      ObjectId("6922c71ac9e0de915584a81a"),
      ObjectId("6923f4ed390a789470182ea2"),
      ObjectId("6923e95123c33dfcf314142f"),
      ObjectId("6923e95923c33dfcf3141431"),
      ObjectId("6923e96123c33dfcf3141433"),
      ObjectId("6923e96923c33dfcf3141435"),
      ObjectId("6923e97423c33dfcf3141437"),
    ],
    totalPrice: 19750000,
    variants: [],
    optionGroups: [],
    changed: [ObjectId("6923f4ed390a789470182ea2")],
    createdAt: ISODate("2025-11-29T05:04:50.077Z"),
    updatedAt: ISODate("2025-11-29T05:04:50.077Z"),
    __v: 0,
  },
  {
    _id: ObjectId("692a7ef21ac548f195b3f09a"),
    name: "PC Gaming i5 2024 - cpu + ram",
    brand: "Custom",
    inventory: 10,
    images: [
      "http://localhost:3000/uploads/pcgaming_1.jpg",
      "http://localhost:3000/uploads/pcgaming_2.jpg",
      "http://localhost:3000/uploads/pcgaming_3.jpg",
    ],
    description: "PC gaming tầm trung sử dụng i5 12400F.",
    productType: "Computer",
    baseName: "PC Gaming i5",
    variantId: ObjectId("692a7ef21ac548f195b3f086"),
    components: [
      ObjectId("6922c705c9e0de915584a818"),
      ObjectId("6922c71ac9e0de915584a81a"),
      ObjectId("6923e94123c33dfcf314142d"),
      ObjectId("6923e95123c33dfcf314142f"),
      ObjectId("6923e95923c33dfcf3141431"),
      ObjectId("6923e96123c33dfcf3141433"),
      ObjectId("6923e96923c33dfcf3141435"),
      ObjectId("6923e97423c33dfcf3141437"),
    ],
    totalPrice: 25000000,
    variants: [],
    optionGroups: [],
    changed: [ObjectId("6922c705c9e0de915584a818")],
    createdAt: ISODate("2025-11-29T05:04:50.108Z"),
    updatedAt: ISODate("2025-11-29T05:04:50.108Z"),
    __v: 0,
  },
  {
    _id: ObjectId("692a7ef21ac548f195b3f0a3"),
    name: "PC Gaming i5 2024 - cpu + ram",
    brand: "Custom",
    inventory: 10,
    images: [
      "http://localhost:3000/uploads/pcgaming_1.jpg",
      "http://localhost:3000/uploads/pcgaming_2.jpg",
      "http://localhost:3000/uploads/pcgaming_3.jpg",
    ],
    description: "PC gaming tầm trung sử dụng i5 12400F.",
    productType: "Computer",
    baseName: "PC Gaming i5",
    variantId: ObjectId("692a7ef21ac548f195b3f086"),
    components: [
      ObjectId("6922c705c9e0de915584a818"),
      ObjectId("6922c71ac9e0de915584a81a"),
      ObjectId("6923f4ed390a789470182ea2"),
      ObjectId("6923e95123c33dfcf314142f"),
      ObjectId("6923e95923c33dfcf3141431"),
      ObjectId("6923e96123c33dfcf3141433"),
      ObjectId("6923e96923c33dfcf3141435"),
      ObjectId("6923e97423c33dfcf3141437"),
    ],
    totalPrice: 25450000,
    variants: [],
    optionGroups: [],
    changed: [
      ObjectId("6922c705c9e0de915584a818"),
      ObjectId("6923f4ed390a789470182ea2"),
    ],
    createdAt: ISODate("2025-11-29T05:04:50.134Z"),
    updatedAt: ISODate("2025-11-29T05:04:50.134Z"),
    __v: 0,
  },
];

let carts = [
  {
    _id: ObjectId("6922dc4a7b6d736b14525d4c"),
    userId: "user123",
    items: [
      {
        productId: ObjectId("6922c865dfbeffdd7fc1ad79"),
        quantity: 2,
        _id: ObjectId("6922e148920c11023758b268"),
      },
    ],
    __v: 3,
  },
  {
    _id: ObjectId("6922dcfd7b6d736b14525d55"),
    userId: "userABC",
    items: [
      {
        productId: ObjectId("6922c71ac9e0de915584a81a"),
        quantity: 13,
        _id: ObjectId("6922dcfd7b6d736b14525d57"),
      },
      {
        productId: ObjectId("6921794fd37aef91e9063b97"),
        quantity: 2,
        _id: ObjectId("6922e0023e960a3bab9eb910"),
      },
      {
        productId: ObjectId("6922c865dfbeffdd7fc1ad79"),
        quantity: 1,
        _id: ObjectId("6922e0143e960a3bab9eb915"),
      },
    ],
    __v: 3,
  },
];

let coupons = [
  {
    "code": "384921",
    "max": 8,
    "usage": 0,
    "expiredDate": "2025-12-07T00:00:00.000Z",
    "discount": 23,
    "minCondition": 14200000
  },
  {
    "code": "927450",
    "max": 4,
    "usage": 0,
    "expiredDate": "2025-12-10T00:00:00.000Z",
    "discount": 10,
    "minCondition": 22400000
  },
  {
    "code": "510284",
    "max": 6,
    "usage": 0,
    "expiredDate": "2025-12-11T00:00:00.000Z",
    "discount": 55,
    "minCondition": 7000000
  },
  {
    "code": "661392",
    "max": 9,
    "usage": 0,
    "expiredDate": "2025-12-12T00:00:00.000Z",
    "discount": 85,
    "minCondition": 12000000
  },
  {
    "code": "840129",
    "max": 10,
    "usage": 0,
    "expiredDate": "2025-12-13T00:00:00.000Z",
    "discount": 12,
    "minCondition": 17400000
  },
  {
    "code": "492610",
    "max": 3,
    "usage": 0,
    "expiredDate": "2025-12-08T00:00:00.000Z",
    "discount": 66,
    "minCondition": 9000000
  },
  {
    "code": "175943",
    "max": 7,
    "usage": 0,
    "expiredDate": "2025-12-06T00:00:00.000Z",
    "discount": 5,
    "minCondition": 28000000
  },
  {
    "code": "903842",
    "max": 5,
    "usage": 0,
    "expiredDate": "2025-12-14T00:00:00.000Z",
    "discount": 100,
    "minCondition": 21000000
  },
  {
    "code": "220498",
    "max": 6,
    "usage": 0,
    "expiredDate": "2025-12-09T00:00:00.000Z",
    "discount": 33,
    "minCondition": 19500000
  },
  {
    "code": "374821",
    "max": 2,
    "usage": 0,
    "expiredDate": "2025-12-13T00:00:00.000Z",
    "discount": 41,
    "minCondition": 25000000
  },
  {
    "code": "558301",
    "max": 1,
    "usage": 0,
    "expiredDate": "2025-12-07T00:00:00.000Z",
    "discount": 60,
    "minCondition": 13000000
  },
  {
    "code": "693024",
    "max": 9,
    "usage": 0,
    "expiredDate": "2025-12-12T00:00:00.000Z",
    "discount": 72,
    "minCondition": 8000000
  },
  {
    "code": "802915",
    "max": 4,
    "usage": 0,
    "expiredDate": "2025-12-11T00:00:00.000Z",
    "discount": 25,
    "minCondition": 18500000
  },
  {
    "code": "947520",
    "max": 10,
    "usage": 0,
    "expiredDate": "2025-12-08T00:00:00.000Z",
    "discount": 15,
    "minCondition": 14700000
  },
  {
    "code": "310864",
    "max": 8,
    "usage": 0,
    "expiredDate": "2025-12-14T00:00:00.000Z",
    "discount": 90,
    "minCondition": 30000000
  },
  {
    "code": "764120",
    "max": 5,
    "usage": 0,
    "expiredDate": "2025-12-10T00:00:00.000Z",
    "discount": 44,
    "minCondition": 16000000
  },
  {
    "code": "514239",
    "max": 7,
    "usage": 0,
    "expiredDate": "2025-12-06T00:00:00.000Z",
    "discount": 32,
    "minCondition": 22000000
  },
  {
    "code": "682431",
    "max": 3,
    "usage": 0,
    "expiredDate": "2025-12-09T00:00:00.000Z",
    "discount": 17,
    "minCondition": 7800000
  },
  {
    "code": "129754",
    "max": 6,
    "usage": 0,
    "expiredDate": "2025-12-07T00:00:00.000Z",
    "discount": 58,
    "minCondition": 26000000
  },
  {
    "code": "906371",
    "max": 9,
    "usage": 0,
    "expiredDate": "2025-12-12T00:00:00.000Z",
    "discount": 21,
    "minCondition": 17000000
  }
]

let users = [
  {
    "_id": "6757c0010000000000000001",
    "email": "user1@example.com",
    "password": "$2a$10$VvBtuD739/.S3bl0H5UpD.dWB5T9zu8V1RdPUGYdbUfaLcF5OCLPu",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000002",
    "email": "user2@example.com",
    "password": "$2a$10$mwTCgNcoQW.05lpbzoC/AOOt.jCTbc5vGcWV8qxRLilvPdajh7/uC",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000003",
    "email": "user3@example.com",
    "password": "$2a$10$8ojeYtKMUK.nEvw3GG63felZvdqQRfC8LUIqSVJWJ0pZNsxIB9o.q",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000004",
    "email": "user4@example.com",
    "password": "$2a$10$.hr./RnOAGvgkXRCa8cWDubflfMlRfR5XJKe2IvMoefSpvBgjf7Da",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000005",
    "email": "user5@example.com",
    "password": "$2a$10$G2trRY9l2LGBksNJUnnBKefiXGTjZEd5bmcEfAPMziJ8V1MHX3LgC",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000006",
    "email": "user6@example.com",
    "password": "$2a$10$8ABy9sFWip78jYlaq4t0RuqWYSCDBcOLf9zuM1xqFESdt99NzRcdC",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000007",
    "email": "user7@example.com",
    "password": "$2a$10$ILciqS1J8clrj1CbbX2EWOtPn5N70Gx4qv6bfhAMxieCG9Q5elOwm",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000008",
    "email": "user8@example.com",
    "password": "$2a$10$QRRfHMjknIfFxdXkXdCTa.zih4PjWxJFbg8L5yK8Jo3P.zG1b/fF.",
    "role": "customer"
  },
  {
    "_id": "6757c0010000000000000009",
    "email": "user9@example.com",
    "password": "$2a$10$cKFem2d2oVIicMjbHrsUFOpY67RKOhmkzAvZrZu49Mu8BV8YMzgka",
    "role": "customer"
  },
  {
    "_id": "6757c001000000000000000A",
    "email": "user10@example.com",
    "password": "$2a$10$oZu7/Oi2XzFfF.KmYj.65u4JTXG1535zzqAfWBEUqghODWFDA8WKK",
    "role": "customer"
  }
]

let customers = [
  {
    "_id": "6757c0010000000000000001",
    "fullname": "User One",
    "email": "user1@example.com",
    "role": "customer",
    "addresses": ["123 Street A, District 1, City X"],
    "loyaltyPoint": 120
  },
  {
    "_id": "6757c0010000000000000002",
    "fullname": "User Two",
    "email": "user2@example.com",
    "role": "customer",
    "addresses": ["45 Nguyen Trai, Ward 5, City Y"],
    "loyaltyPoint": 315
  },
  {
    "_id": "6757c0010000000000000003",
    "fullname": "User Three",
    "email": "user3@example.com",
    "role": "customer",
    "addresses": ["99 Le Loi, District 3, City Z"],
    "loyaltyPoint": 280
  },
  {
    "_id": "6757c0010000000000000004",
    "fullname": "User Four",
    "email": "user4@example.com",
    "role": "customer",
    "addresses": ["12 Tran Hung Dao, District 4, City X"],
    "loyaltyPoint": 455
  },
  {
    "_id": "6757c0010000000000000005",
    "fullname": "User Five",
    "email": "user5@example.com",
    "role": "customer",
    "addresses": ["7 Phan Chu Trinh, Ward 2, City Y"],
    "loyaltyPoint": 390
  },
  {
    "_id": "6757c0010000000000000006",
    "fullname": "User Six",
    "email": "user6@example.com",
    "role": "customer",
    "addresses": ["201 Hai Ba Trung, District 1, City Z"],
    "loyaltyPoint": 150
  },
  {
    "_id": "6757c0010000000000000007",
    "fullname": "User Seven",
    "email": "user7@example.com",
    "role": "customer",
    "addresses": ["88 Bach Dang, District 3, City X"],
    "loyaltyPoint": 270
  },
  {
    "_id": "6757c0010000000000000008",
    "fullname": "User Eight",
    "email": "user8@example.com",
    "role": "customer",
    "addresses": ["5 Hoang Hoa Tham, Ward 7, City Y"],
    "loyaltyPoint": 498
  },
  {
    "_id": "6757c0010000000000000009",
    "fullname": "User Nine",
    "email": "user9@example.com",
    "role": "customer",
    "addresses": ["321 Tran Phu, District 6, City Z"],
    "loyaltyPoint": 305
  },
  {
    "_id": "6757c001000000000000000A",
    "fullname": "User Ten",
    "email": "user10@example.com",
    "role": "customer",
    "addresses": ["10 Pasteur, District 1, City X"],
    "loyaltyPoint": 421
  }
]

let orders = [
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2025-05-24T02:15:44Z"),
    "totalMoney": 2700000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 3
      },
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4f"
  },
  {
    "customerId": "6757c0010000000000000007",
    "email": "user7@example.com",
    "deliveryAddress": "88 Bach Dang, District 3, City X",
    "purchaseDate": ISODate("2024-12-09T21:53:06Z"),
    "totalMoney": 7500000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2025-07-13T12:55:21Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 224
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-05-28T14:03:23Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 108
  },
  {
    "customerId": "6757c001000000000000000A",
    "email": "user10@example.com",
    "deliveryAddress": "10 Pasteur, District 1, City X",
    "purchaseDate": ISODate("2025-03-02T00:47:03Z"),
    "totalMoney": 2700000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 3
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f52"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2025-09-16T03:01:27Z"),
    "totalMoney": 12750000,
    "items": [
      {
        "productId": "6922c705c9e0de915584a818",
        "quantity": 1
      },
      {
        "productId": "6923f4ed390a789470182ea2",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4c",
    "loyaltyPoint": 188
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2024-08-06T10:37:58Z"),
    "totalMoney": 450000,
    "items": [
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-03-18T06:42:12Z"),
    "totalMoney": 25450000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f0a3",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f55"
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2024-12-25T19:20:00Z"),
    "totalMoney": 1650000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      },
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 0
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2025-11-22T07:33:51Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 251
  },
  {
    "customerId": "6757c0010000000000000007",
    "email": "user7@example.com",
    "deliveryAddress": "88 Bach Dang, District 3, City X",
    "purchaseDate": ISODate("2024-04-02T05:16:40Z"),
    "totalMoney": 5700000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      },
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f49"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2025-02-14T23:44:17Z"),
    "totalMoney": 3050000,
    "items": [
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 282
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-09-03T09:05:02Z"),
    "totalMoney": 1200000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-01-01T00:00:59Z"),
    "totalMoney": 19750000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f091",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f54"
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2025-06-30T11:12:18Z"),
    "totalMoney": 19300000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 253
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2024-11-08T18:51:37Z"),
    "totalMoney": 5100000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      },
      {
        "productId": "6923f4ed390a789470182ea2",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-06-19T04:44:55Z"),
    "totalMoney": 6000000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 0
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f53"
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2025-10-04T15:30:09Z"),
    "totalMoney": 2500000,
    "items": [
      {
        "productId": "6922c71ac9e0de915584a81a",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 114
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-02-10T02:22:36Z"),
    "totalMoney": 1650000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      },
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 0
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-10-21T09:11:03Z"),
    "totalMoney": 2550000,
    "items": [
      {
        "productId": "6922c71ac9e0de915584a81a",
        "quantity": 1
      },
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 0
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f47",
    "loyaltyPoint": 289
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2025-01-30T22:09:58Z"),
    "totalMoney": 15200000,
    "items": [
      {
        "productId": "6922c705c9e0de915584a818",
        "quantity": 1
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2025-08-11T13:14:27Z"),
    "totalMoney": 7600000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 0
      },
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f50"
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-07-17T07:06:34Z"),
    "totalMoney": 900000,
    "items": [
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2025-04-05T01:25:12Z"),
    "totalMoney": 2850000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e95123c33dfcf314142f",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 140
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2025-06-02T20:38:00Z"),
    "totalMoney": 750000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2024-11-11T11:11:11Z"),
    "totalMoney": 19300000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f59",
    "loyaltyPoint": 182
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-03-05T16:00:00Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2025-12-01T00:00:00Z"),
    "totalMoney": 25450000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f0a3",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f56"
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2024-02-28T08:22:44Z"),
    "totalMoney": 5700000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 0
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 268
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2024-06-01T03:30:30Z"),
    "totalMoney": 450000,
    "items": [
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2025-07-04T07:07:07Z"),
    "totalMoney": 7600000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 0
      },
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f51"
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-09-09T12:12:12Z"),
    "totalMoney": 1650000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 115
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-10-10T10:10:10Z"),
    "totalMoney": 1650000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2024-05-05T05:05:05Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f48"
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-12-01T12:00:00Z"),
    "totalMoney": 8800000,
    "items": [
      {
        "productId": "6922c705c9e0de915584a818",
        "quantity": 0
      },
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2025-03-15T09:40:00Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 0
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 140
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-11-20T20:20:20Z"),
    "totalMoney": 7500000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4b",
    "loyaltyPoint": 199
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-08-30T14:14:14Z"),
    "totalMoney": 19750000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f091",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2025-09-30T09:09:09Z"),
    "totalMoney": 750000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 150
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2024-01-15T08:08:08Z"),
    "totalMoney": 25450000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f0a3",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f52"
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-04-04T04:44:44Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2025-05-01T05:01:05Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f50",
    "loyaltyPoint": 173
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-03-12T12:12:12Z"),
    "totalMoney": 1200000,
    "items": [
      {
        "productId": "6923e95923c33dfcf3141431",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2025-07-21T21:21:21Z"),
    "totalMoney": 3050000,
    "items": [
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f58"
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-01-20T20:20:20Z"),
    "totalMoney": 19300000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 199
  },
  {
    "customerId": "6757c0010000000000000007",
    "email": "user7@example.com",
    "deliveryAddress": "88 Bach Dang, District 3, City X",
    "purchaseDate": ISODate("2024-02-02T02:02:02Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2025-10-10T10:10:10Z"),
    "totalMoney": 19750000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f091",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f54",
    "loyaltyPoint": 144
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2025-02-02T02:02:02Z"),
    "totalMoney": 2500000,
    "items": [
      {
        "productId": "6922c71ac9e0de915584a81a",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-05-15T15:15:15Z"),
    "totalMoney": 2850000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      },
      {
        "productId": "6923e95123c33dfcf314142f",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 173
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-07-07T07:07:07Z"),
    "totalMoney": 900000,
    "items": [
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4e"
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2025-01-01T01:01:01Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-10-30T23:23:23Z"),
    "totalMoney": 3050000,
    "items": [
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      },
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 2
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 116
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2025-06-06T06:06:06Z"),
    "totalMoney": 25450000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f0a3",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f57"
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-09-01T09:09:09Z"),
    "totalMoney": 2700000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 3
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 145
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2024-08-08T08:08:08Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-11-11T11:11:11Z"),
    "totalMoney": 7500000,
    "items": [
      {
        "productId": "6923e97423c33dfcf3141437",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f49",
    "loyaltyPoint": 200
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2025-05-05T05:05:05Z"),
    "totalMoney": 19300000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2024-02-22T22:22:22Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4d"
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-12-12T12:12:12Z"),
    "totalMoney": 1350000,
    "items": [
      {
        "productId": "6923f4ed390a789470182ea2",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 180
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2024-06-06T06:06:06Z"),
    "totalMoney": 12750000,
    "items": [
      {
        "productId": "6922c705c9e0de915584a818",
        "quantity": 1
      },
      {
        "productId": "6923f4ed390a789470182ea2",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4c"
  },
  {
    "customerId": "6757c0010000000000000003",
    "email": "user3@example.com",
    "deliveryAddress": "99 Le Loi, District 3, City Z",
    "purchaseDate": ISODate("2025-11-30T11:11:11Z"),
    "totalMoney": 450000,
    "items": [
      {
        "productId": "6923e96923c33dfcf3141435",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 140
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-03-03T03:03:03Z"),
    "totalMoney": 25450000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f0a3",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000009",
    "email": "user9@example.com",
    "deliveryAddress": "321 Tran Phu, District 6, City Z",
    "purchaseDate": ISODate("2025-04-04T04:44:44Z"),
    "totalMoney": 3800000,
    "items": [
      {
        "productId": "6921794fd37aef91e9063b97",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f51",
    "loyaltyPoint": 220
  },
  {
    "customerId": "6757c0010000000000000005",
    "email": "user5@example.com",
    "deliveryAddress": "7 Phan Chu Trinh, Ward 2, City Y",
    "purchaseDate": ISODate("2024-09-09T09:09:09Z"),
    "totalMoney": 750000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000007",
    "email": "user7@example.com",
    "deliveryAddress": "88 Bach Dang, District 3, City X",
    "purchaseDate": ISODate("2024-04-04T04:04:04Z"),
    "totalMoney": 19300000,
    "items": [
      {
        "productId": "692a7ef21ac548f195b3f086",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 210
  },
  {
    "customerId": "6757c0010000000000000002",
    "email": "user2@example.com",
    "deliveryAddress": "45 Nguyen Trai, Ward 5, City Y",
    "purchaseDate": ISODate("2024-08-20T20:20:20Z"),
    "totalMoney": 2700000,
    "items": [
      {
        "productId": "6923e96123c33dfcf3141433",
        "quantity": 3
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4a"
  },
  {
    "customerId": "6757c0010000000000000004",
    "email": "user4@example.com",
    "deliveryAddress": "12 Tran Hung Dao, District 4, City X",
    "purchaseDate": ISODate("2025-08-08T08:08:08Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6923f523390a789470182ea5",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 187
  },
  {
    "customerId": "6757c0010000000000000006",
    "email": "user6@example.com",
    "deliveryAddress": "201 Hai Ba Trung, District 1, City Z",
    "purchaseDate": ISODate("2025-11-01T11:11:11Z"),
    "totalMoney": 9500000,
    "items": [
      {
        "productId": "6922c705c9e0de915584a818",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "couponId": "692c160069b31ed43dce5f4f"
  },
  {
    "customerId": "6757c0010000000000000008",
    "email": "user8@example.com",
    "deliveryAddress": "5 Hoang Hoa Tham, Ward 7, City Y",
    "purchaseDate": ISODate("2024-12-12T12:00:00Z"),
    "totalMoney": 1350000,
    "items": [
      {
        "productId": "6923f4ed390a789470182ea2",
        "quantity": 1
      }
    ],
    "status": "Paid"
  },
  {
    "customerId": "6757c0010000000000000001",
    "email": "user1@example.com",
    "deliveryAddress": "123 Street A, District 1, City X",
    "purchaseDate": ISODate("2024-05-05T05:05:05Z"),
    "totalMoney": 3300000,
    "items": [
      {
        "productId": "6922c71ac9e0de915584a81a",
        "quantity": 1
      },
      {
        "productId": "6923e94123c33dfcf314142d",
        "quantity": 1
      }
    ],
    "status": "Paid",
    "loyaltyPoint": 128
  }
]

db.products.drop();
db.products.insertMany(products);
db.carts.insertMany(carts);

db = db.getSiblingDB("coupons")
db.coupons.drop()
db.coupons.insertMany(coupons)

db = db.getSiblingDB("auth")
db.users.insertOne({ email: "admin@gmail.com", password: "$2a$10$adAVcBam05yfpy3zo2KE1eiyWyBoWIKXSx0ychgpQeLyo2GinFHuO", role: 'admin' })
db.users.insertMany(users)

db = db.getSiblingDB("customers")
db.customers.insertMany(customers)

db = db.getSiblingDB("orders")
db.orders.insertMany(orders)

print("Products data inserted successfully!");
