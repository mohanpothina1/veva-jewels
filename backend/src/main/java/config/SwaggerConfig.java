package config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Veva Jewels API")
                        .description("API documentation for Veva Jewels backend")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Veva Jewels Support")
                                .email("support@vevajewels.com")
                                .url("https://vevajewels.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("Veva Jewels GitHub Repository")
                        .url("https://github.com/vevajewels"));
    }
}
