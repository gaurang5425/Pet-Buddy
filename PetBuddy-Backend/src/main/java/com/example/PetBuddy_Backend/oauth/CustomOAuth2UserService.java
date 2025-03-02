package com.example.PetBuddy_Backend.oauth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;


@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        try {
            // Extract user details from OAuth2User
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");
            String googleId = oauth2User.getAttribute("sub");
            
            logger.info("Attempting to save/update user with email: {}", email);
            
            // Check if user exists
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                logger.info("Creating new user for email: {}", email);
                user = new User(email, name, picture, googleId,null);
            } else {
                logger.info("Updating existing user for email: {}", email);
                user.setName(name);
                user.setPicture(picture);
                user.setGoogleId(googleId);
            }
            
            User savedUser = userRepository.save(user);
            logger.info("Successfully saved user with ID: {}", savedUser.getId());
            
        } catch (Exception e) {
            logger.error("Error while saving user", e);
        }
        
        return oauth2User;
    }
}