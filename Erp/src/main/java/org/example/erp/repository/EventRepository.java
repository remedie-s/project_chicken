package org.example.erp.repository;

import org.example.erp.entity.Employee;
import org.example.erp.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
