package com.commerceiq.config;

import com.commerceiq.model.*;
import com.commerceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        if (supplierRepository.count() == 0) {
            seedSuppliers();
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (customerRepository.count() == 0) {
            seedCustomers();
        }
        if (orderRepository.count() == 0) {
            seedOrders();
        }
        if (paymentRepository.count() == 0) {
            seedPayments();
        }
        if (notificationRepository.count() == 0) {
            seedNotifications();
        }
    }

    private void seedUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@commerceiq.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setRole(Role.ROLE_ADMIN);
        userRepository.save(admin);

        User manager = new User();
        manager.setUsername("manager");
        manager.setEmail("manager@commerceiq.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setFullName("Sales Manager");
        manager.setRole(Role.ROLE_MANAGER);
        userRepository.save(manager);

        User staff = new User();
        staff.setUsername("staff");
        staff.setEmail("staff@commerceiq.com");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setFullName("Store Staff");
        staff.setRole(Role.ROLE_STAFF);
        userRepository.save(staff);

        User customerUser = new User();
        customerUser.setUsername("customer");
        customerUser.setEmail("customer@commerceiq.com");
        customerUser.setPassword(passwordEncoder.encode("customer123"));
        customerUser.setFullName("Demo Customer");
        customerUser.setRole(Role.ROLE_CUSTOMER);
        userRepository.save(customerUser);
    }

    private void seedCategories() {
        String[][] categories = {
            {"Electronics", "Premium gadgets and devices"},
            {"Clothing", "Fashion apparel and accessories"},
            {"Books", "Educational and entertainment books"},
            {"Home & Kitchen", "Household essentials and decor"},
            {"Sports", "Outdoor and fitness products"},
            {"Beauty", "Personal care and cosmetics"},
            {"Toys", "Kids and family entertainment"},
            {"Food & Beverages", "Everyday pantry and drinks"},
            {"Furniture", "Modern home furnishings"},
            {"Office Supplies", "Workplace essentials"}
        };
        for (String[] category : categories) {
            Category cat = new Category();
            cat.setName(category[0]);
            cat.setDescription(category[1]);
            categoryRepository.save(cat);
        }
    }

    private void seedSuppliers() {
        String[][] suppliers = {
            {"TechSupply Co.", "techsupply@email.com", "+1-555-0101", "John Tech", "123 Supplier St, Business City"},
            {"FashionWorld Ltd.", "fashion@email.com", "+1-555-0102", "Jane Fashion", "88 Style Avenue, Business City"},
            {"BookHouse Inc.", "books@email.com", "+1-555-0103", "Mike Books", "21 Reading Lane, Business City"},
            {"HomeGoods Corp.", "home@email.com", "+1-555-0104", "Sarah Home", "41 Furnish Rd, Business City"},
            {"SportsPro", "sports@email.com", "+1-555-0105", "Tom Sports", "12 Arena Drive, Business City"},
            {"GlowBeauty", "glow@email.com", "+1-555-0106", "Nina Beauty", "9 Spa Blvd, Business City"},
            {"PlayWorld", "play@email.com", "+1-555-0107", "Chris Toys", "6 Fun Park, Business City"},
            {"FreshMart", "fresh@email.com", "+1-555-0108", "Liam Foods", "13 Market Street, Business City"}
        };
        for (String[] s : suppliers) {
            Supplier sup = new Supplier();
            sup.setName(s[0]);
            sup.setEmail(s[1]);
            sup.setPhone(s[2]);
            sup.setContactPerson(s[3]);
            sup.setAddress(s[4]);
            supplierRepository.save(sup);
        }
    }

    private void seedProducts() {
        Category electronics = categoryRepository.findByName("Electronics").orElse(null);
        Category clothing = categoryRepository.findByName("Clothing").orElse(null);
        Category books = categoryRepository.findByName("Books").orElse(null);
        Category home = categoryRepository.findByName("Home & Kitchen").orElse(null);
        Category sports = categoryRepository.findByName("Sports").orElse(null);
        Category beauty = categoryRepository.findByName("Beauty").orElse(null);
        Supplier techSupplier = supplierRepository.findAll().get(0);
        Supplier fashionSupplier = supplierRepository.findAll().get(1);
        Supplier bookSupplier = supplierRepository.findAll().get(2);
        Supplier homeSupplier = supplierRepository.findAll().get(3);
        Supplier sportsSupplier = supplierRepository.findAll().get(4);
        Supplier beautySupplier = supplierRepository.findAll().get(5);

        Object[][] products = {
            {"Laptop Pro 15", "High-performance laptop", "LP-001", new BigDecimal("1299.99"), new BigDecimal("900.00"), 50, electronics, techSupplier},
            {"Wireless Mouse", "Ergonomic wireless mouse", "WM-002", new BigDecimal("39.99"), new BigDecimal("20.00"), 200, electronics, techSupplier},
            {"USB-C Hub", "7-port USB-C hub", "UH-003", new BigDecimal("59.99"), new BigDecimal("30.00"), 150, electronics, techSupplier},
            {"Bluetooth Speaker", "Portable speaker", "BS-004", new BigDecimal("89.99"), new BigDecimal("45.00"), 80, electronics, techSupplier},
            {"Mechanical Keyboard", "RGB mechanical keyboard", "MK-005", new BigDecimal("149.99"), new BigDecimal("80.00"), 60, electronics, techSupplier},
            {"Running Shoes", "Premium running shoes", "RS-101", new BigDecimal("129.99"), new BigDecimal("65.00"), 100, clothing, fashionSupplier},
            {"Cotton T-Shirt", "100% cotton t-shirt", "CT-102", new BigDecimal("29.99"), new BigDecimal("10.00"), 300, clothing, fashionSupplier},
            {"Denim Jeans", "Slim fit jeans", "DJ-103", new BigDecimal("79.99"), new BigDecimal("35.00"), 150, clothing, fashionSupplier},
            {"The Data Science Handbook", "Hands-on analytics reference", "BK-201", new BigDecimal("49.99"), new BigDecimal("18.00"), 90, books, bookSupplier},
            {"Smart Blender", "High-speed kitchen blender", "HK-301", new BigDecimal("129.99"), new BigDecimal("75.00"), 70, home, homeSupplier},
            {"Yoga Mat", "Non-slip exercise mat", "SP-401", new BigDecimal("34.99"), new BigDecimal("16.50"), 140, sports, sportsSupplier},
            {"Hydrating Serum", "Daily skin hydration serum", "BE-501", new BigDecimal("24.99"), new BigDecimal("11.00"), 110, beauty, beautySupplier},
            {"Coffee Maker", "Compact drip coffee maker", "HK-302", new BigDecimal("79.99"), new BigDecimal("42.00"), 65, home, homeSupplier}
        };

        for (Object[] p : products) {
            Product prod = new Product();
            prod.setName((String) p[0]);
            prod.setDescription((String) p[1]);
            prod.setSku((String) p[2]);
            prod.setPrice((BigDecimal) p[3]);
            prod.setCostPrice((BigDecimal) p[4]);
            prod.setStockQuantity((Integer) p[5]);
            prod.setCategory((Category) p[6]);
            prod.setSupplier((Supplier) p[7]);
            productRepository.save(prod);
        }
    }

    private void seedCustomers() {
        String[][] customers = {
            {"Alice", "Johnson", "alice@email.com", "+1-555-1001", "New York"},
            {"Bob", "Smith", "bob@email.com", "+1-555-1002", "Los Angeles"},
            {"Carol", "White", "carol@email.com", "+1-555-1003", "Chicago"},
            {"David", "Brown", "david@email.com", "+1-555-1004", "Houston"},
            {"Emma", "Davis", "emma@email.com", "+1-555-1005", "Phoenix"},
            {"Frank", "Wilson", "frank@email.com", "+1-555-1006", "Philadelphia"},
            {"Grace", "Taylor", "grace@email.com", "+1-555-1007", "San Antonio"},
            {"Henry", "Anderson", "henry@email.com", "+1-555-1008", "Dallas"},
            {"Ivy", "Martinez", "ivy@email.com", "+1-555-1009", "Austin"},
            {"Jack", "Clark", "jack@email.com", "+1-555-1010", "Denver"}
        };
        for (String[] c : customers) {
            Customer cust = new Customer();
            cust.setFirstName(c[0]);
            cust.setLastName(c[1]);
            cust.setEmail(c[2]);
            cust.setPhone(c[3]);
            cust.setCity(c[4]);
            cust.setCountry("USA");
            cust.setAddress("123 Main St, " + c[4]);
            customerRepository.save(cust);
        }
    }

    private void seedOrders() {
        List<Customer> customers = customerRepository.findAll();
        List<Product> products = productRepository.findAll();
        if (customers.isEmpty() || products.isEmpty()) {
            return;
        }

        String[] notes = {"Priority delivery", "Gift wrap", "Repeat customer", "Bulk order", "Follow-up requested", "VIP request", "Urgent dispatch", "Seasonal campaign"};
        for (int i = 0; i < 12; i++) {
            Customer customer = customers.get(i % customers.size());
            Product product = products.get(i % products.size());
            Order order = new Order();
            order.setCustomer(customer);
            order.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(1 + i)));
            order.setTaxAmount(order.getSubtotal().multiply(new BigDecimal("0.08")));
            order.setDiscount(i % 3 == 0 ? new BigDecimal("10.00") : BigDecimal.ZERO);
            order.setTotalAmount(order.getSubtotal().add(order.getTaxAmount()).subtract(order.getDiscount()));
            order.setShippingAddress(customer.getAddress() + ", " + customer.getCity());
            order.setStatus(Order.OrderStatus.values()[i % Order.OrderStatus.values().length]);
            order.setNotes(notes[i % notes.length]);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(1 + (i % 4));
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

            order.setOrderItems(List.of(item));
            orderRepository.save(order);
        }
    }

    private void seedPayments() {
        List<Order> orders = orderRepository.findAll();
        if (orders.isEmpty()) {
            return;
        }

        for (int i = 0; i < Math.min(orders.size(), 12); i++) {
            Order order = orders.get(i);
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setTransactionId("TXN-2026-" + (1000 + i));
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod(Payment.PaymentMethod.values()[i % Payment.PaymentMethod.values().length]);
            payment.setStatus(i % 2 == 0 ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.PENDING);
            payment.setNotes("Sample payment for " + order.getOrderNumber());
            paymentRepository.save(payment);
        }
    }

    private void seedNotifications() {
        String[][] notifications = {
            {"Low stock alert", "Laptop Pro 15 stock has dropped below 10 units.", "WARNING", "ROLE_STAFF"},
            {"New order received", "A new high-value order is awaiting confirmation.", "INFO", "ROLE_MANAGER"},
            {"Payment pending", "One payment is still awaiting completion.", "SUCCESS", "ROLE_ADMIN"},
            {"Inventory update", "Premium sneakers have been restocked.", "INFO", "ROLE_STAFF"},
            {"Customer follow-up", "A repeat customer requested a callback this week.", "WARNING", "ROLE_MANAGER"},
            {"Seasonal campaign", "A new seasonal campaign is ready to launch.", "INFO", "ROLE_ADMIN"},
            {"Supplier reminder", "A supplier follow-up is due this afternoon.", "WARNING", "ROLE_MANAGER"},
            {"Order shipped", "A recent order has been marked as shipped.", "SUCCESS", "ROLE_STAFF"}
        };
        for (String[] n : notifications) {
            Notification notification = new Notification();
            notification.setTitle(n[0]);
            notification.setMessage(n[1]);
            notification.setType(n[2]);
            notification.setTargetRole(n[3]);
            notificationRepository.save(notification);
        }
    }
}
