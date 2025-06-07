package controller;

import model.Anklet;
import service.AnkletService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anklets")
@CrossOrigin("*")
public class AnkletController {

    private final AnkletService ankletService;

    public AnkletController(AnkletService ankletService) {
        this.ankletService = ankletService;
    }

    // Get All Anklets
    @GetMapping
    public List<Anklet> getAllAnklets() {
        return ankletService.getAllAnklets();
    }

    // Get Anklet by ID
    @GetMapping("/{id}")
    public Anklet getAnkletById(@PathVariable String id) {
        return ankletService.getAnkletById(id);
    }

    // Create New Anklet
    @PostMapping
    public Anklet createAnklet(@RequestBody Anklet anklet) {
        return ankletService.createAnklet(anklet);
    }

    // Update Anklet
    @PutMapping("/{id}")
    public Anklet updateAnklet(@PathVariable String id, @RequestBody Anklet ankletDetails) {
        return ankletService.updateAnklet(id, ankletDetails);
    }

    // Delete Anklet
    @DeleteMapping("/{id}")
    public String deleteAnklet(@PathVariable String id) {
        ankletService.deleteAnklet(id);
        return "Anklet deleted successfully!";
    }
}
