package com.example.PetBuddy_Backend.oauth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class OauthSecurityConfiguration {

    private final CustomOAuth2UserService customOAuth2UserService;

    public OauthSecurityConfiguration(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers("/**").permitAll()
                    .anyRequest().authenticated();
            })
            .oauth2Login(oauth2 -> {
                oauth2.userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                );
                oauth2.defaultSuccessUrl("http://localhost:5173/UserProfile", true);
            })
            .logout(logout -> {
                logout.logoutSuccessUrl("http://localhost:5173/Login")
                    .permitAll();
            });

        return http.build();
    }
}
