package com.tasker.rush.repository;

import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findById(Long id);
    List<Project> findProjectsByUser(User user);

    Optional<Project> findByIdAndUser(Long id, User user);
}
