package com.example.PetBuddy_Backend.ServiceRequest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceRequestService {
    
    private final ServiceRequestRepository requestRepository;
    
    @Autowired
    public ServiceRequestService(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }
    
    // Create a new service request
    public ServiceRequest createRequest(ServiceRequest request) {
        return requestRepository.save(request);
    }
    
    // Get all requests
    public List<ServiceRequest> getAllRequests() {
        return requestRepository.findAll();
    }
    
    // Get request by ID
    public Optional<ServiceRequest> getRequestById(Long id) {
        return requestRepository.findById(id);
    }
    
    // Get requests by userName
    public List<ServiceRequest> getRequestsByUserName(String userName) {
        return requestRepository.findByUserName(userName);
    }
    
    // Get requests by owner
    public List<ServiceRequest> getRequestsByOwner(String owner) {
        return requestRepository.findByOwner(owner);
    }
    
    // Get requests by service type
    public List<ServiceRequest> getRequestsByServiceType(String serviceType) {
        return requestRepository.findByServiceSelected(serviceType);
    }
    
    // Update request status based on ServiceRequest object
    public ServiceRequest updateRequestStatus(ServiceRequest requestObj) {
        Optional<ServiceRequest> existingRequestOpt = requestRepository.findById(requestObj.getId());
        
        if (existingRequestOpt.isPresent()) {
            ServiceRequest existingRequest = existingRequestOpt.get();
            existingRequest.setStatus(requestObj.getStatus());
            return requestRepository.save(existingRequest);
        }
        
        return null;
    }
    
    // Update an existing request
    public ServiceRequest updateRequest(Long id, ServiceRequest updatedRequest) {
        Optional<ServiceRequest> existingRequest = requestRepository.findById(id);
        
        if (existingRequest.isPresent()) {
            ServiceRequest request = existingRequest.get();
            
            // Update fields
            request.setUserName(updatedRequest.getUserName());
            request.setOwner(updatedRequest.getOwner());
            request.setServiceSelected(updatedRequest.getServiceSelected());
            request.setNumberOfPets(updatedRequest.getNumberOfPets());
            request.setPetType(updatedRequest.getPetType());
            request.setBreed(updatedRequest.getBreed());
            request.setSize(updatedRequest.getSize());
            request.setAdditionalInfo(updatedRequest.getAdditionalInfo());
            request.setStartDate(updatedRequest.getStartDate());
            request.setPrice(updatedRequest.getPrice());
            request.setStatus(updatedRequest.getStatus());
            
            return requestRepository.save(request);
        }
        
        return null;
    }
    
    // Delete a request
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}