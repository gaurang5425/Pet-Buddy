package com.example.PetBuddy_Backend.ServiceRequest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    
    // Method to find requests by userName
    List<ServiceRequest> findByUserName(String userName);
    
    // Method to find requests by owner
    List<ServiceRequest> findByOwner(String owner);
    
    // Method to find requests by service type
    List<ServiceRequest> findByServiceSelected(String serviceSelected);
    
    // Method to find requests by status
    List<ServiceRequest> findByStatus(String status);
}