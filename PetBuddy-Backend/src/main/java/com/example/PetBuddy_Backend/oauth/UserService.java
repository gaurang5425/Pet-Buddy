package com.example.PetBuddy_Backend.oauth;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createOrUpdateUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            user = new User();
        }
        
        // Update user information
        user.setEmail(email);
        user.setName(oauth2User.getAttribute("name"));
        user.setPicture(oauth2User.getAttribute("picture"));
        user.setGoogleId(oauth2User.getAttribute("sub")); // Google's unique identifier
           System.out.print(user);
        return userRepository.save(user);
    }
}
