package controller;

import model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.CartService;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem item) {
        return cartService.addToCart(item);
    }

    @PostMapping("/bulk")
    public List<CartItem> bulkAddToCart(@RequestBody List<CartItem> items) {
        return cartService.bulkAddToCart(items);
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable String userId) {
        return cartService.getCartByUser(userId);
    }

    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable String id, @RequestParam int quantity) {
        return cartService.updateCartItem(id, quantity);
    }

    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable String id) {
        cartService.deleteCartItem(id);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable String userId) {
        cartService.deleteAllByUser(userId);
    }
}
