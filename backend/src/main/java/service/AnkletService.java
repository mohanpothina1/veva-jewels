package service;

import model.Anklet;
import repository.AnkletRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnkletService {

    private final AnkletRepository ankletRepository;

    public AnkletService(AnkletRepository ankletRepository) {
        this.ankletRepository = ankletRepository;
    }

    // Get All Anklets
    public List<Anklet> getAllAnklets() {
        return ankletRepository.findAll();
    }

    // Create New Anklet
    public Anklet createAnklet(Anklet anklet) {
        return ankletRepository.save(anklet);
    }

    // Get Anklet by ID
    public Anklet getAnkletById(String id) {
        return ankletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anklet not found"));
    }

    // Update Anklet
    public Anklet updateAnklet(String id, Anklet ankletDetails) {
        Anklet anklet = getAnkletById(id);
        anklet.setDescription(ankletDetails.getDescription());
        anklet.setPrice(ankletDetails.getPrice());
        anklet.setImages(ankletDetails.getImages());
        return ankletRepository.save(anklet);
    }

    // Delete Anklet
    public void deleteAnklet(String id) {
        ankletRepository.deleteById(id);
    }
}
