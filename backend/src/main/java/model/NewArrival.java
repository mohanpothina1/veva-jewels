package model;


import java.util.List;

public class NewArrival {

    private String id;

    private String name;

    private int price;

    private List<String> images;

    private double rating;

    private int reviews;

    public NewArrival() {
    }

    public NewArrival(String id, String name, int price, List<String> images, double rating, int reviews) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.images = images;
        this.rating = rating;
        this.reviews = reviews;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }
}
