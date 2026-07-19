package com.tasker.rush.dto;

import com.tasker.rush.entity.Project;
import com.tasker.rush.entity.Task;

import java.util.List;

public class UserProjects {
    public List<Project> projects;
    public Project selectedProject;
    public List<Task> todoTasks;
    public List<Task> inProgressTasks;
    public List<Task> doneTasks;
}
