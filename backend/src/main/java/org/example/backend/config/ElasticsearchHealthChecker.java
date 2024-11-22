package org.example.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Component;



@Component
public class ElasticsearchHealthChecker {
    private final ElasticsearchOperations operations;

    public ElasticsearchHealthChecker(ElasticsearchOperations operations) {
        this.operations = operations;
    }

    @PostConstruct
    public void checkHealth() {
        boolean isUp = operations.indexOps(IndexCoordinates.of("products")).exists();
        if (!isUp) {
            throw new RuntimeException("Elasticsearch is not reachable or 'products' index does not exist!");
        }
    }
}
