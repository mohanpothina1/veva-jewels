package model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "wishlist")
public class WishlistItem {
    @Id
    private String id;
    private String userId;
    private String productId;
    private String name;
    private int price;
    private List<String> image;

    // Constructors, Getters, and Setters
    public WishlistItem() {}

    public WishlistItem(String id, String userId, String productId, String name, int price, List<String> image) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.image = image;
    }

    // Getters and setters...


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public List<String> getImage() {
        return image;
    }

    public void setImage(List<String> image) {
        this.image = image;
    }
}
