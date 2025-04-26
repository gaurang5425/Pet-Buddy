package com.example.PetBuddy_Backend.PetService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pet-services")
public class PetServiceController {
    
    private final PetServiceService petServiceService;
    
    @Autowired
    public PetServiceController(PetServiceService petServiceService) {
        this.petServiceService = petServiceService;
    }
    
    // Create a new pet service
    @PostMapping(value = "/upload", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PetService> createPetService(@RequestBody PetService petService) {
        // The handling of image conversion is now done in the service layer
        PetService createdPetService = petServiceService.createPetService(petService);
        return new ResponseEntity<>(createdPetService, HttpStatus.CREATED);
    }
    // Get all pet services
    @GetMapping
    public ResponseEntity<List<PetService>> getAllPetServices() {
        List<PetService> petServices = petServiceService.getAllPetServices();
        return new ResponseEntity<>(petServices, HttpStatus.OK);
    }
    
    // Get pet service by ID
    @GetMapping("/{id}")
    public ResponseEntity<PetService> getPetServiceById(@PathVariable Long id) {
        Optional<PetService> petService = petServiceService.getPetServiceById(id);
        return petService
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get pet service by exact name
    @GetMapping("/name/{name}")
    public ResponseEntity<PetService> getPetServiceByName(@PathVariable String name) {
        Optional<PetService> petService = petServiceService.getPetServiceByName(name);
        return petService
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/ownername/{ownerName}")
    public List<PetService> getPetServiceByOwnerName(@PathVariable String ownerName) {
        List<PetService> petService = petServiceService.getPetServiceByOwnerName(ownerName);
        return petService;
    }

    // Get pet services by location
    @GetMapping("/location")
    public ResponseEntity<List<PetService>> getPetServicesByLocation(@RequestParam String location) {
        List<PetService> petServices = petServiceService.getPetServicesByLocation(location);
        return new ResponseEntity<>(petServices, HttpStatus.OK);
    }
    
    // Get pet services by service type
    @GetMapping("/service-type/{serviceType}")
    public ResponseEntity<List<PetService>> getPetServicesByServiceType(@PathVariable String serviceType) {
        List<PetService> petServices = petServiceService.getPetServicesByServiceType(serviceType);
        return new ResponseEntity<>(petServices, HttpStatus.OK);
    }
    
    // Get pet services by pet type
    @GetMapping("/pet-type/{petType}")
    public ResponseEntity<List<PetService>> getPetServicesByPetType(@PathVariable String petType) {
        List<PetService> petServices = petServiceService.getPetServicesByPetType(petType);
        return new ResponseEntity<>(petServices, HttpStatus.OK);
    }
    
    // Update a pet service
    @PutMapping(value="/{name}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PetService> updatePetService(@PathVariable String name, @RequestBody PetService petService) {
        try {
            PetService updatedPetService = petServiceService.updatePetService(name, petService);
            return new ResponseEntity<>(updatedPetService, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping(value = "/{name}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PetService> patchPetService(@PathVariable String name, @RequestBody Map<String, Object> updates) {
        try {
            PetService updatedPetService = petServiceService.patchPetService(name, updates);
            return new ResponseEntity<>(updatedPetService, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping(value = "/{id}/rating-review", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PetService> updateRatingAndReview(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            PetService updatedPetService = petServiceService.updateRatingAndReview(id, updates);
            return new ResponseEntity<>(updatedPetService, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(value="/id/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PetService> updatePetServiceById(@PathVariable Long id, @RequestBody PetService petService) {
        try {
            PetService updatedPetService = petServiceService.updatePetServiceById(id, petService);
            return new ResponseEntity<>(updatedPetService, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a pet service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePetService(@PathVariable Long id) {
        try {
            petServiceService.deletePetService(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
