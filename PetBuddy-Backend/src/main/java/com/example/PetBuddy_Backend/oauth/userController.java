package com.example.PetBuddy_Backend.oauth;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class userController {

    private final UserRepository userRepository;
    
    userController(UserRepository userRepository) {
        super();
        this.userRepository = userRepository;
    }
    
    @GetMapping("/user-info")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return principal.getAttributes();
    }
    
    // Get user by email
    @GetMapping("/by-email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Update user role by email
    @PutMapping("/update-role/{email}/{role}")
    public ResponseEntity<User> updateUserRole(@PathVariable String email, @PathVariable String role) {
        User user = userRepository.findByEmail(email);
        
        if (user != null) {
            user.setRole(role);
            User updatedUser = userRepository.save(user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Update user profile image
    @PutMapping("/update-profile-image/{email}")
    public ResponseEntity<User> updateProfileImage(@PathVariable String email, @RequestBody ProfileImageRequest request) {
    	  User user = userRepository.findByEmail(email);
    	    
    	    if (user != null && request.getProfileImage() != null) {
    	        // Decode Base64 string to byte array
    	        byte[] imageBytes = java.util.Base64.getDecoder().decode(request.getProfileImage());
    	        user.setProfileImage(imageBytes);
    	        User updatedUser = userRepository.save(user);
    	        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    	    } else {
    	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	    }}
    public static class ProfileImageRequest {
        private String profileImage; // Base64 encoded image
        
        public String getProfileImage() {
            return profileImage;
        }
        
        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }
    }
    }
    
  
