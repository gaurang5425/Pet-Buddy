package com.example.PetBuddy_Backend.PetService;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PetServiceService {
    
    private final PetServiceRepository petServiceRepository;
    
    @Autowired
    public PetServiceService(PetServiceRepository petServiceRepository) {
        this.petServiceRepository = petServiceRepository;
    }
    
    // Create a new pet service
    // Create a new pet service
    public PetService createPetService(PetService petService) {
        // Handle main image
        if (petService.getBase64Image() != null && petService.getImage() == null) {
            petService.setImage(Base64.getDecoder().decode(petService.getBase64Image()));
        }
        
        // Handle additional images
        if (petService.getBase64MoreImages() != null && !petService.getBase64MoreImages().isEmpty()) {
            petService.setBase64MoreImages(petService.getBase64MoreImages());
        }
        
        return petServiceRepository.save(petService);
    }
    
    // Get all pet services
    public List<PetService> getAllPetServices() {
        return petServiceRepository.findAll();
    }
    
    // Get pet service by ID
    public Optional<PetService> getPetServiceById(Long id) {
        return petServiceRepository.findById(id);
    }
    
    // Get pet service by exact name
    public Optional<PetService> getPetServiceByName(String name) {
        return petServiceRepository.findByName(name);
    }
    public Optional<PetService> getPetServiceByOwnerName(String name) {
        return petServiceRepository.findByOwnerName(name);
    }
    
    // Get pet services by location
    public List<PetService> getPetServicesByLocation(String location) {
        return petServiceRepository.findByLocationContainingIgnoreCase(location);
    }
    
    // Get pet services by service type
    public List<PetService> getPetServicesByServiceType(String serviceType) {
        return petServiceRepository.findByServiceType(serviceType);
    }
    
    // Get pet services by pet type
    public List<PetService> getPetServicesByPetType(String petType) {
        return petServiceRepository.findByPetType(petType);
    }
    
    
    // Update a pet service
    public PetService updatePetService(String name, PetService petServiceDetails) {
        Optional<PetService> petServiceOptional = petServiceRepository.findByName(name);
        if (petServiceOptional.isPresent()) {
            PetService existingPetService = petServiceOptional.get();
            
            // Update fields
            existingPetService.setName(petServiceDetails.getName());
            existingPetService.setOwnerName(petServiceDetails.getOwnerName());
            existingPetService.setLocation(petServiceDetails.getLocation());
            existingPetService.setDistance(petServiceDetails.getDistance());
            existingPetService.setDescription(petServiceDetails.getDescription());
            existingPetService.setRating(petServiceDetails.getRating());
            existingPetService.setReviews(petServiceDetails.getReviews());
            existingPetService.setCompletedBookings(petServiceDetails.getCompletedBookings());
            existingPetService.setPrice(petServiceDetails.getPrice());
            
            // Handle main image
            if (petServiceDetails.getBase64Image() != null && !petServiceDetails.getBase64Image().isEmpty()) {
                existingPetService.setImage(Base64.getDecoder().decode(petServiceDetails.getBase64Image()));
            } else if (petServiceDetails.getImage() != null) {
                existingPetService.setImage(petServiceDetails.getImage());
            }
            
            // Handle additional images
            if (petServiceDetails.getBase64MoreImages() != null && !petServiceDetails.getBase64MoreImages().isEmpty()) {
                existingPetService.setBase64MoreImages(petServiceDetails.getBase64MoreImages());
            } else if (petServiceDetails.getMoreImages() != null) {
                existingPetService.setMoreImages(petServiceDetails.getMoreImages());
            }
            
            existingPetService.setBadges(petServiceDetails.getBadges());
            existingPetService.setServiceType(petServiceDetails.getServiceType());
            existingPetService.setPetTypes(petServiceDetails.getPetTypes());
            
            return petServiceRepository.save(existingPetService);
        } else {
            throw new RuntimeException("Pet service not found with name: " + name);
        }
    }
    
    // Delete a pet service
    public void deletePetService(Long id) {
        petServiceRepository.deleteById(id);
    }
}

