package com.veva_jewels;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication(scanBasePackages = "com.veva_jewels")
@ComponentScan(basePackages = {"com.veva_jewels", "model", "repository", "controller", "service","jwt","config"})
@EnableMongoRepositories(basePackages = "repository")
public class VevaJewelsApplication {

	public static void main(String[] args) {
		SpringApplication.run(VevaJewelsApplication.class, args);
	}


	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		// Allow credentials
		config.setAllowCredentials(true);

		// Allow requests from both localhost and your Vercel app
		config.setAllowedOrigins(Arrays.asList( "http://localhost:3000"));

		// Allow all headers and methods
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");

		// Add exposed headers if needed
		config.addExposedHeader("Authorization");

		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}

}

