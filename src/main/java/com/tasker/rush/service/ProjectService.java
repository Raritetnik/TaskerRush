package com.tasker.rush.service;

import com.tasker.rush.dto.UserProjects;
import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.Task;
import com.tasker.rush.entity.TaskStatus;
import com.tasker.rush.entity.User;
import com.tasker.rush.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public UserProjects findAllUserProjects(User user, Long projectId) {
        List<Project> projectList = projectRepository.findProjectsByUser(user);
        Project selectedProject = null;
        if(projectId == null) {
            selectedProject = projectList
                    .stream()
                    .findFirst()
                    .orElse(null);
        } else {
            selectedProject = projectList
                    .stream()
                    .filter(p -> p.getId().equals(projectId))
                    .findFirst()
                    .orElse(null);
        }

        List<Task> todoTasks = new ArrayList<>();
        List<Task> inProgressTasks = new ArrayList<>();
        List<Task> doneTasks = new ArrayList<>();

        if (
                selectedProject != null &&
                        selectedProject.getTasks() != null
        ) {
            todoTasks = selectedProject.getTasks()
                    .stream()
                    .filter(task ->
                            (task.getStatus() == TaskStatus.TO_DO || task.getStatus() == TaskStatus.PENDING)
                    )
                    .toList();

            inProgressTasks = selectedProject.getTasks()
                    .stream()
                    .filter(task ->
                            task.getStatus() == TaskStatus.IN_PROGRESS
                    )
                    .toList();

            doneTasks = selectedProject.getTasks()
                    .stream()
                    .filter(task ->
                            task.getStatus() == TaskStatus.DONE
                    )
                    .toList();
        }
        UserProjects projects = new UserProjects();
        projects.projects = projectList;
        projects.selectedProject = selectedProject;
        projects.todoTasks = todoTasks;
        projects.inProgressTasks = inProgressTasks;
        projects.doneTasks= doneTasks;
        return projects;
    }
}
