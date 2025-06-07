package service;


import model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.CartRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public CartItem addToCart(CartItem item) {
        return cartRepository.save(item);
    }

    public List<CartItem> getCartByUser(String userId) {
        return cartRepository.findByUserId(userId);
    }

    public CartItem updateCartItem(String id, int quantity) {
        Optional<CartItem> optional = cartRepository.findById(id);
        if (optional.isPresent()) {
            CartItem item = optional.get();
            item.setQuantity(quantity);
            return cartRepository.save(item);
        }
        return null;
    }

    public void deleteCartItem(String id) {
        cartRepository.deleteById(id);
    }

    public void deleteAllByUser(String userId) {
        cartRepository.deleteByUserId(userId);
    }

    public List<CartItem> bulkAddToCart(List<CartItem> items) {
        return cartRepository.saveAll(items);
    }
}

