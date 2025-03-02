	package com.example.PetBuddy_Backend.oauth;
	
	import org.springframework.data.jpa.repository.JpaRepository;
	
	public interface UserRepository extends JpaRepository<User, Long> {
	    User findByEmail(String email);
	    User findByRole(String role);
	}
