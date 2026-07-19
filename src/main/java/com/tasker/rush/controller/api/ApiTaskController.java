package com.tasker.rush.controller.api;

import com.tasker.rush.dto.CreateTaskRequest;
import com.tasker.rush.dto.TaskResponse;
import com.tasker.rush.dto.UpdateTaskRequest;
import com.tasker.rush.entity.Task;
import com.tasker.rush.entity.User;
import com.tasker.rush.service.TaskService;
import com.tasker.rush.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class ApiTaskController {

    private final TaskService taskService;
    private final UserService userService;


    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody @Valid CreateTaskRequest request
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        Task task = taskService.createTask(user, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TaskResponse.from(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody @Valid UpdateTaskRequest request
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        Task task = taskService.updateTask(
                user,
                id,
                request
        );

        return ResponseEntity.ok(
                TaskResponse.from(task)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        taskService.deleteTask(user, id);

        return ResponseEntity.noContent().build();
    }
}