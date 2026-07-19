package com.tasker.rush.repository;

import com.tasker.rush.dto.CreateTaskRequest;
import com.tasker.rush.entity.Task;
import com.tasker.rush.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findById(long id);
    Optional<Task> findByIdAndProjectUser(Long id, User projectUser);
}
