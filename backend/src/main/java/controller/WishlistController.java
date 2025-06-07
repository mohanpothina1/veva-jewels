package controller;


import model.User;
import model.WishlistItem;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @GetMapping
    public ResponseEntity<?> getWishlist(Authentication authentication) {
        // Step 1: Get the authenticated user
        User user = (User) authentication.getPrincipal();

        // Step 2: Access their ID
        String userId = user.getId();

        // Step 3: Fetch wishlist from database using userId
        // Example:
        List<WishlistItem> wishlist = wishlistRepository.findByUserId(userId);

        return ResponseEntity.ok(wishlist);
    }

    // POST /api/wishlist
    @PostMapping
    public WishlistItem addToWishlist(@RequestBody WishlistItem item) {
        Optional<WishlistItem> existing = wishlistRepository.findByUserIdAndProductId(item.getUserId(), item.getProductId());
        if (existing.isEmpty()) {
            return wishlistRepository.save(item);
        }
        return existing.get();
    }

    // POST /api/wishlist/bulk
    @PostMapping("/bulk")
    public List<WishlistItem> addBulk(@RequestBody List<WishlistItem> items) {
        List<WishlistItem> savedItems = new ArrayList<>();
        for (WishlistItem item : items) {
            if (!wishlistRepository.existsByUserIdAndProductId(item.getUserId(), item.getProductId())) {
                savedItems.add(wishlistRepository.save(item));
            }
        }
        return savedItems;
    }

    // GET /api/wishlist/{userId}
    @GetMapping("/{userId}")
    public List<WishlistItem> getUserWishlist(@PathVariable String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    // DELETE /api/wishlist/{productId}?userId=xxx
    @DeleteMapping("/{productId}")
    public void removeFromWishlist(@PathVariable String productId, @RequestParam String userId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // GET /api/wishlist/check/{productId}?userId=xxx
    @GetMapping("/check/{productId}")
    public Map<String, Boolean> isWishlisted(@PathVariable String productId, @RequestParam String userId) {
        boolean exists = wishlistRepository.existsByUserIdAndProductId(userId, productId);
        return Collections.singletonMap("isWishlisted", exists);
    }
}
