package com.example.app.config;

import com.example.app.model.User;
import com.example.app.model.UserStatus;
import com.example.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Update all users with null status to ACTIVE
        List<User> usersWithNullStatus = userRepository.findAll().stream()
                .filter(user -> user.getStatus() == null)
                .toList();
        
        if (!usersWithNullStatus.isEmpty()) {
            for (User user : usersWithNullStatus) {
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
            }
            System.out.println("Updated " + usersWithNullStatus.size() + " users with null status to ACTIVE");
        }
    }
}

