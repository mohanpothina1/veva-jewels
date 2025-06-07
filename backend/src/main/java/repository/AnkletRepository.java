package repository;

import model.Anklet;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnkletRepository extends MongoRepository<Anklet, String> {
}
