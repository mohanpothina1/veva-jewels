package controller;

import model.NewArrival;
import model.Product;
import service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products API", description = "Manage products for Veva Jewels")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve all products available in the database")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get products by category", description = "Retrieve products by their specific category (e.g., anklets, toe rings, etc.)")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return products.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(products);
    }

    @PostMapping
    @Operation(summary = "Add a new product", description = "Add a new product to the database")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product savedProduct = productService.addProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a single product using its ID")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}/{id}")
    public ResponseEntity<Product> getProductByCategoryAndId(@PathVariable String category, @PathVariable String id) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent() && productOpt.get().getCategory().equalsIgnoreCase(category)) {
            return ResponseEntity.ok(productOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/review")
    public ResponseEntity<Product> addReview(@RequestParam String productId, @RequestParam int rating) {
        Product updatedProduct = productService.addReview(productId, rating);
        return ResponseEntity.ok(updatedProduct);
    }


    @GetMapping("/newarrivals")
    public ResponseEntity<List<NewArrival>> getNewArrivals() {
        List<NewArrival> arrivals = productService.getNewArrivals();
        return ResponseEntity.ok(arrivals);
    }



}
