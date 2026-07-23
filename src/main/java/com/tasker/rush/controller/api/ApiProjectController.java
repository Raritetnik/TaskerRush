package com.tasker.rush.controller.api;

import com.tasker.rush.dto.CreateProjectRequest;
import com.tasker.rush.dto.ProjectResponse;
import com.tasker.rush.dto.UpdateProjectRequest;
import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.User;
import com.tasker.rush.service.ProjectService;
import com.tasker.rush.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ApiProjectController {

    private final ProjectService projectService;
    private final UserService userService;


    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody @Valid CreateProjectRequest request
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        Project project = projectService.createProject(user, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProjectResponse.from(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody @Valid UpdateProjectRequest request
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        Project task = projectService.updateProject(
                user,
                id,
                request
        );

        return ResponseEntity.ok(
                ProjectResponse.from(task)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {

        User user = userService.findByUsername(
                currentUser.getUsername()
        );

        projectService.deleteProject(user, id);

        return ResponseEntity.noContent().build();
    }
}