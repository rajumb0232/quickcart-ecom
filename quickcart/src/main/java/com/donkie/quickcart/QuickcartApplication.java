package com.donkie.quickcart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing(auditorAwareRef = "quickcartAuditor")
public class QuickcartApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickcartApplication.class, args);
	}

}
