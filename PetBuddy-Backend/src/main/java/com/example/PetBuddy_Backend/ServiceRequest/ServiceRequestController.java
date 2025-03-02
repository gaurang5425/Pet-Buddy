package com.example.PetBuddy_Backend.ServiceRequest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class ServiceRequestController {
    
    private final ServiceRequestService requestService;
    
    @Autowired
    public ServiceRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }
    
    // Create a new request
    @PostMapping("/requests")
    public ResponseEntity<ServiceRequest> createRequest(@RequestBody ServiceRequest request) {
        ServiceRequest createdRequest = requestService.createRequest(request);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }
    
    // Get all requests
    @GetMapping("/requests")
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        List<ServiceRequest> requests = requestService.getAllRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get request by ID
    @GetMapping("/requests/{id}")
    public ResponseEntity<ServiceRequest> getRequestById(@PathVariable("id") Long id) {
        Optional<ServiceRequest> request = requestService.getRequestById(id);
        
        if (request.isPresent()) {
            return new ResponseEntity<>(request.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get requests by userName
    @GetMapping("/requests/user/{userName}")
    public ResponseEntity<List<ServiceRequest>> getRequestsByUserName(@PathVariable("userName") String userName) {
        List<ServiceRequest> requests = requestService.getRequestsByUserName(userName);
        
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get requests by owner
    @GetMapping("/requests/owner/{owner}")
    public ResponseEntity<List<ServiceRequest>> getRequestsByOwner(@PathVariable("owner") String owner) {
        List<ServiceRequest> requests = requestService.getRequestsByOwner(owner);
        
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get requests by service type
    @GetMapping("/requests/service/{serviceType}")
    public ResponseEntity<List<ServiceRequest>> getRequestsByServiceType(@PathVariable("serviceType") String serviceType) {
        List<ServiceRequest> requests = requestService.getRequestsByServiceType(serviceType);
        
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Update request status with request object
    @PutMapping("/requests/update-status")
    public ResponseEntity<ServiceRequest> updateRequestStatus(@RequestBody ServiceRequest requestObj) {
        ServiceRequest updatedRequest = requestService.updateRequestStatus(requestObj);
        
        if (updatedRequest != null) {
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Update a request
    @PutMapping("/requests/{id}")
    public ResponseEntity<ServiceRequest> updateRequest(
            @PathVariable("id") Long id,
            @RequestBody ServiceRequest request) {
        
        ServiceRequest updatedRequest = requestService.updateRequest(id, request);
        
        if (updatedRequest != null) {
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete a request
    @DeleteMapping("/requests/{id}")
    public ResponseEntity<HttpStatus> deleteRequest(@PathVariable("id") Long id) {
        requestService.deleteRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}