package com.trainbooking.config;

import com.trainbooking.entity.Role;
import com.trainbooking.entity.Train;
import com.trainbooking.entity.TrainClass;
import com.trainbooking.entity.User;
import com.trainbooking.repository.TrainRepository;
import com.trainbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrainRepository trainRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TrainRepository trainRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.trainRepository = trainRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create Admin user if not exists
        if (!userRepository.existsByEmail("admin@trains.com")) {
            User admin = new User(
                    "Admin User",
                    "admin@trains.com",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println(">>> Seed Admin user created: admin@trains.com / admin123");
        }

        // Create Regular user if not exists
        if (!userRepository.existsByEmail("user@trains.com")) {
            User user = new User(
                    "Rahul Sharma",
                    "user@trains.com",
                    passwordEncoder.encode("user123"),
                    Role.USER
            );
            userRepository.save(user);
            System.out.println(">>> Seed Demo user created: user@trains.com / user123");
        }

        // Seed sample trains if table is empty
        if (trainRepository.count() == 0) {
            seedTrains();
        }
    }

    private void seedTrains() {
        // Train 1: Rajdhani Express (Delhi -> Lucknow)
        Train t1 = new Train("12430", "Rajdhani Express", "Delhi", "Lucknow", "06:30", "12:45", "6h 15m");
        t1.addClass(new TrainClass("SL", 650.0, 72));
        t1.addClass(new TrainClass("3A", 1250.0, 72));
        t1.addClass(new TrainClass("2A", 1850.0, 48));
        t1.addClass(new TrainClass("1A", 3200.0, 24));
        trainRepository.save(t1);

        // Train 2: Shatabdi Express (Delhi -> Jaipur)
        Train t2 = new Train("12015", "Ajmer Shatabdi Express", "Delhi", "Jaipur", "06:10", "10:40", "4h 30m");
        t2.addClass(new TrainClass("CC", 780.0, 90));
        t2.addClass(new TrainClass("EC", 1450.0, 45));
        t2.addClass(new TrainClass("3A", 1100.0, 72));
        t2.addClass(new TrainClass("2A", 1600.0, 48));
        trainRepository.save(t2);

        // Train 3: Vande Bharat Express (Mumbai -> Ahmedabad)
        Train t3 = new Train("20901", "Vande Bharat Express", "Mumbai", "Ahmedabad", "06:00", "11:25", "5h 25m");
        t3.addClass(new TrainClass("CC", 1385.0, 100));
        t3.addClass(new TrainClass("EC", 2505.0, 50));
        t3.addClass(new TrainClass("3A", 1750.0, 72));
        t3.addClass(new TrainClass("1A", 3500.0, 24));
        trainRepository.save(t3);

        // Train 4: Duronto Express (Kolkata -> Delhi)
        Train t4 = new Train("12259", "Sealdah Duronto Express", "Kolkata", "Delhi", "18:30", "11:00", "16h 30m");
        t4.addClass(new TrainClass("SL", 890.0, 144));
        t4.addClass(new TrainClass("3A", 2150.0, 144));
        t4.addClass(new TrainClass("2A", 3050.0, 96));
        t4.addClass(new TrainClass("1A", 4850.0, 24));
        trainRepository.save(t4);

        // Train 5: Karnataka Sampark Kranti (Bengaluru -> Delhi)
        Train t5 = new Train("12649", "Karnataka Sampark Kranti", "Bengaluru", "Delhi", "13:50", "09:15", "33h 25m");
        t5.addClass(new TrainClass("SL", 920.0, 216));
        t5.addClass(new TrainClass("3A", 2350.0, 144));
        t5.addClass(new TrainClass("2A", 3400.0, 96));
        t5.addClass(new TrainClass("1A", 5400.0, 24));
        trainRepository.save(t5);

        System.out.println(">>> 5 Seed Trains successfully populated in Database!");
    }
}
