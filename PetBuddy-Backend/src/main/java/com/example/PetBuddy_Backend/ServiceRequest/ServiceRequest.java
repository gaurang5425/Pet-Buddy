package com.example.PetBuddy_Backend.ServiceRequest;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {
    
    @Id
    private Long id;
    
    private String userName;
    private String owner;
    private String serviceSelected;
    private Integer numberOfPets;
    private String petType;
    private String breed;
    private String size;
    private String additionalInfo;
    private LocalDateTime startDate;
    private Double price;
    private String status;
    
    // Default constructor
    public ServiceRequest() {
    }
    
    // Parameterized constructor
    public ServiceRequest(String userName, String owner, String serviceSelected, Integer numberOfPets, 
                           String petType, String breed, String size, String additionalInfo, 
                           LocalDateTime startDate, Double price, String status) {
        this.userName = userName;
        this.owner = owner;
        this.serviceSelected = serviceSelected;
        this.numberOfPets = numberOfPets;
        this.petType = petType;
        this.breed = breed;
        this.size = size;
        this.additionalInfo = additionalInfo;
        this.startDate = startDate;
        this.price = price;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getOwner() {
        return owner;
    }
    
    public void setOwner(String owner) {
        this.owner = owner;
    }
    
    public String getServiceSelected() {
        return serviceSelected;
    }
    
    public void setServiceSelected(String serviceSelected) {
        this.serviceSelected = serviceSelected;
    }
    
    public Integer getNumberOfPets() {
        return numberOfPets;
    }
    
    public void setNumberOfPets(Integer numberOfPets) {
        this.numberOfPets = numberOfPets;
    }
    
    public String getPetType() {
        return petType;
    }
    
    public void setPetType(String petType) {
        this.petType = petType;
    }
    
    public String getBreed() {
        return breed;
    }
    
    public void setBreed(String breed) {
        this.breed = breed;
    }
    
    public String getSize() {
        return size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }
    
    public String getAdditionalInfo() {
        return additionalInfo;
    }
    
    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
    
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return "ServiceRequest{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", owner='" + owner + '\'' +
                ", serviceSelected='" + serviceSelected + '\'' +
                ", numberOfPets=" + numberOfPets +
                ", petType='" + petType + '\'' +
                ", breed='" + breed + '\'' +
                ", size='" + size + '\'' +
                ", additionalInfo='" + additionalInfo + '\'' +
                ", startDate=" + startDate +
                ", price=" + price +
                ", status='" + status + '\'' +
                '}';
    }
}