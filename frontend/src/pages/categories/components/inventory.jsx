// Comprehensive Product Inventory
const inventory = {
    electronics: [
        {
            id: 1,
            name: "Ultra-Slim 4K OLED Smart TV",
            category: "ELEC",
            subcategory: {
                id: 1,
                name: "TV & Home Theater",
                slug: "tv-home-theater"
            },
            price: 1299.99,
            description: "Experience cinematic brilliance with our Ultra-Slim 4K OLED Smart TV. Featuring perfect black levels, infinite contrast, and smart connectivity, this TV transforms your living room into a premium entertainment hub.",
            rating: 4.8,
            features: [
                "4K Ultra HD Resolution",
                "OLED Display Technology",
                "Smart TV Capabilities",
                "HDR10+ Support",
                "Thin Bezel Design"
            ],
            image_url: "/assets/electronics/tv-home-theater/tv/tv2.jpg",
            additional_images: [
                "/assets/electronics/tv-home-theater/tv/tv3.jpg",
                "/assets/electronics/tv-home-theater/tv/tv4.jpg"
            ]
        },
        {
            id: 2,
            name: "High-Performance Gaming Laptop",
            category: "ELEC",
            subcategory: {
                id: 2,
                name: "Computers & Smartphones",
                slug: "computers-smartphones"
            },
            price: 1499.99,
            description: "Unleash ultimate computing power with our High-Performance Gaming Laptop. Designed for gamers and content creators, this laptop delivers top-tier performance in a sleek, portable package.",
            rating: 4.7,
            features: [
                "12th Gen Intel Core i7 Processor",
                "NVIDIA RTX 3070 Graphics",
                "16GB DDR5 RAM",
                "1TB NVMe SSD",
                "15.6\" QHD Display"
            ],
            image_url: "/assets/electronics/computers-smarthphones/laptop/laptop.png",
            additional_images: [
                "/assets/electronics/computers-smarthphones/laptop/laptop2.jpg",
                "/assets/electronics/computers-smarthphones/laptop/laptop3.jpg"
            ]
        },
        {
            id: 3,
            name: "Advanced Aerial Photography Drone",
            category: "ELEC",
            subcategory: {
                id: 3,
                name: "Home Tools",
                slug: "home-tools"
            },
            price: 799.99,
            description: "Capture breathtaking aerial footage with our Advanced Aerial Photography Drone. Equipped with cutting-edge stabilization technology and a 4K camera, it's perfect for photographers, videographers, and outdoor enthusiasts.",
            rating: 4.6,
            features: [
                "4K Ultra HD Camera",
                "30-Minute Flight Time",
                "GPS Navigation",
                "Advanced Obstacle Avoidance",
                "Compact Folding Design"
            ],
            image_url: "/assets/electronics/home-tools/drone/drone1.png",
            additional_images: [
                "/assets/electronics/home-tools/drone/drone2.png"
            ]
        }
    ],
    food: [
        {
            id: 4,
            name: "Artisan Sourdough Bread Sampler",
            category: "FOOD",
            subcategory: {
                id: 4,
                name: "Groceries",
                slug: "groceries"
            },
            price: 19.99,
            description: "Experience the art of traditional bread-making with our Artisan Sourdough Bread Sampler. Crafted using organic ingredients and a 24-hour fermentation process, each loaf offers a perfect balance of tangy flavor and rustic texture.",
            rating: 4.9,
            features: [
                "Organic Wheat Flour",
                "Natural Sourdough Starter",
                "24-Hour Fermentation",
                "No Preservatives",
                "Handcrafted"
            ],
            image_url: "/assets/food/groceries/bread/bread1.jpg",
            additional_images: [
                "/assets/food/groceries/bread/bread2.jpg",
                "/assets/food/groceries/bread/bread3.jpg",
                "/assets/food/groceries/bread/bread4.jpg",
                "/assets/food/groceries/bread/bread5.jpg",
                "/assets/food/groceries/bread/bread6.jpg"
            ]
        },
        {
            id: 5,
            name: "Gourmet Prepared Goat Meal",
            category: "FOOD",
            subcategory: {
                id: 5,
                name: "Prepared Meals",
                slug: "prepared-meals"
            },
            price: 12.99,
            description: "Indulge in our Gourmet Prepared Goat Meal, a culinary delight crafted by professional chefs. Made with premium ingredients and designed for those seeking convenient, high-quality dining experiences.",
            rating: 4.5,
            features: [
                "Chef-Prepared",
                "Premium Ingredients",
                "Ready to Heat",
                "Balanced Nutrition",
                "Convenient Packaging"
            ],
            image_url: "/assets/food/prepared-meals/goatMeal.jpg",
            additional_images: []
        },
        {
            id: 6,
            name: "Farm-Fresh Organic Milk Collection",
            category: "FOOD",
            subcategory: {
                id: 6,
                name: "Snacks & Beverages",
                slug: "snacks-beverages"
            },
            price: 4.99,
            description: "Savor the pure, rich taste of our Farm-Fresh Organic Milk. Sourced from grass-fed cows and free from hormones, this milk offers exceptional nutrition and a creamy, natural flavor.",
            rating: 4.7,
            features: [
                "100% Organic",
                "Grass-Fed Cows",
                "No Added Hormones",
                "Rich in Calcium",
                "Fresh Daily"
            ],
            image_url: "/assets/food/snacks-beverages/milk/milk.jpg",
            additional_images: [
                "/assets/food/snacks-beverages/milk/milk2.jpg",
                "/assets/food/snacks-beverages/milk/milk3.jpg",
                "/assets/food/snacks-beverages/milk/milk4.jpg"
            ]
        }
    ]
};

export default inventory;