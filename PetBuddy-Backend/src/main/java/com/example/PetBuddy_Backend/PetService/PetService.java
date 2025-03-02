package com.example.PetBuddy_Backend.PetService;

import java.util.Base64;
import java.util.List;


import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "pet_services")
public class PetService {
    
    @Id	
   // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String ownerName;
    private String location;
    private String distance;
    
    @Column(length = 1000)
    private String description;
    
    private Integer rating;
    private Integer reviews;
    private Integer completedBookings;
    private Double price;
    
    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;
    
    @ElementCollection
    @CollectionTable(name = "pet_service_badges", joinColumns = @JoinColumn(name = "pet_service_id"))
    @Column(name = "badge")
    private List<String> badges;
    
    private String serviceType;
    
    @ElementCollection
    @CollectionTable(name = "pet_service_pet_types", joinColumns = @JoinColumn(name = "pet_service_id"))
    @Column(name = "pet_type")
    private List<String> petTypes;
    
    @Transient
    private String base64Image;
    
    
    // Default constructor
    public PetService() {
    }
    
    // Constructor with fields
    public PetService(Long id, String name, String ownerName, String location, String distance, 
                      String description, Integer rating, Integer reviews, Integer completedBookings, 
                      Double price, byte[] image, List<String> badges, String serviceType, List<String> petTypes) {
        this.id = id;
        this.name = name;
        this.ownerName = ownerName;
        this.location = location;
        this.distance = distance;
        this.description = description;
        this.rating = rating;
        this.reviews = reviews;
        this.completedBookings = completedBookings;
        this.price = price;
        this.image = image;
        this.badges = badges;
        this.serviceType = serviceType;
        this.petTypes = petTypes;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDistance() {
        return distance;
    }
    
    public void setDistance(String distance) {
        this.distance = distance;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public Integer getReviews() {
        return reviews;
    }
    
    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }
    
    public Integer getCompletedBookings() {
        return completedBookings;
    }
    
    public void setCompletedBookings(Integer completedBookings) {
        this.completedBookings = completedBookings;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public byte[] getImage() {
        return image;
    }
    
    public void setImage(byte[] image) {
        this.image = image;
    }
    public String getBase64Image() {
        return (image != null) ? Base64.getEncoder().encodeToString(image) : null;
    }

    // Setter for JSON deserialization
    public void setBase64Image(String base64Image) {
        if (base64Image != null && !base64Image.isEmpty()) {
            this.image = Base64.getDecoder().decode(base64Image);}
        }
    
    public List<String> getBadges() {
        return badges;
    }
    
    public void setBadges(List<String> badges) {
        this.badges = badges;
    }
    
    public String getServiceType() {
        return serviceType;
    }
    
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }
    
    public List<String> getPetTypes() {
        return petTypes;
    }
    
    public void setPetTypes(List<String> petTypes) {
        this.petTypes = petTypes;
    }
}