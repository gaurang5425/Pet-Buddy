	package com.example.PetBuddy_Backend.oauth;
	
	import org.springframework.data.jpa.repository.JpaRepository;

	import java.util.List;

	public interface UserRepository extends JpaRepository<User, Long> {
	    User findByEmail(String email);
		List<User> findAll();
	    User findByRole(String role);
	}
