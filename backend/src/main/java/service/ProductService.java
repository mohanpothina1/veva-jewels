package service;

import model.NewArrival;
import model.Product;
import repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category.toLowerCase());
    }

    public Product addProduct(Product product) {
        product.setCategory(product.getCategory().toLowerCase());
        return productRepository.save(product);
    }
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }


    public Product addReview(String productId, int newRating) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();

        int totalReviews = product.getReviews();
        double currentRating = product.getRating();

        double updatedRating = ((currentRating * totalReviews) + newRating) / (totalReviews + 1);
        product.setRating(updatedRating);
        product.setReviews(totalReviews + 1);

        return productRepository.save(product);
    }


    public List<NewArrival> getNewArrivals() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(p -> new NewArrival(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getImages(),
                p.getRating(),
                p.getReviews()
        )).collect(Collectors.toList());
    }

}
