package repository;


import model.WishlistItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<WishlistItem, String> {
    List<WishlistItem> findByUserId(String userId);
    Optional<WishlistItem> findByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndProductId(String userId, String productId);
}
