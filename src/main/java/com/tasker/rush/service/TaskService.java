package com.tasker.rush.service;

import com.tasker.rush.dto.CreateTaskRequest;
import com.tasker.rush.dto.UpdateTaskRequest;
import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.Task;
import com.tasker.rush.entity.User;
import com.tasker.rush.repository.ProjectRepository;
import com.tasker.rush.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {

    public TaskRepository taskRepository;
    public ProjectRepository projectRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public Task createTask(User user, CreateTaskRequest request) {
        Project project = projectRepository
                .findByIdAndUser(
                    request.projectId(),
                    user
                )
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        Task task = new Task();

        if (request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task title is required"
            );
        }
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setProject(project);

        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(
            User user,
            Long taskId,
            UpdateTaskRequest request
    ) {

        Task task = taskRepository
                .findByIdAndProjectUser(taskId, user)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Task not found"
                        )
                );

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(
            User user,
            Long taskId
    ) {

        Task task = taskRepository
                .findByIdAndProjectUser(taskId, user)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Task not found"
                        )
                );

        taskRepository.delete(task);
    }


}
