package com.tasker.rush.controller;

import com.tasker.rush.dto.UserProjects;
import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.User;
import com.tasker.rush.service.ProjectService;
import com.tasker.rush.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class HomeController {
    private final ProjectService projectService;
    private final UserService userService;

    public HomeController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping({"/dashboard", "/dashboard/{id}"})
    public String project(
            @PathVariable(required = false) Long id,
            @AuthenticationPrincipal UserDetails currentUser,
            Model model) {
        User user = userService.findByUsername(currentUser.getUsername());
        UserProjects userData = projectService.findAllUserProjects(user, id);
        model.addAttribute("projects", userData.projects);
        model.addAttribute("selectedProject", userData.selectedProject);
        model.addAttribute("todoTasks", userData.todoTasks);
        model.addAttribute("inProgressTasks", userData.inProgressTasks);
        model.addAttribute("doneTasks", userData.doneTasks);

        model.addAttribute("username", currentUser.getUsername());

        return "task-board";
    }
}
