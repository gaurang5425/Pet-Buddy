package com.example.PetBuddy_Backend.oauth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table()
public class User {
    
    User() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String name;
    private String picture;
    private String googleId;
    private String role;
    
    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGBLOB")
    private byte[] profileImage;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPicture() {
        return picture;
    }
    
    public void setPicture(String picture) {
        this.picture = picture;
    }
    
    public String getGoogleId() {
        return googleId;
    }
    
    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public byte[] getProfileImage() {
        return profileImage;
    }
    
    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }
    
    User(String email, String name, String picture, String googleId, String role) {
        super();
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.role = role;
    }
    
    User(String email, String name, String picture, String googleId, String role, byte[] profileImage) {
        super();
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.role = role;
        this.profileImage = profileImage;
    }
}