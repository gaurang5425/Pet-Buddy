package com.example.PetBuddy_Backend.PetService;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PetServiceRepository extends JpaRepository<PetService, Long> {
    
    // Find by exact name
    Optional<PetService> findByName(String name);

    List<PetService> findByOwnerName(String name);

    List<PetService> findByLocationContainingIgnoreCase(String location);
    
    List<PetService> findByServiceType(String serviceType);
    
    // Find services by pet type (using JPQL)
    @Query("SELECT ps FROM PetService ps JOIN ps.petTypes pt WHERE pt = :petType")
    List<PetService> findByPetType(String petType);
}