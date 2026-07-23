package com.tasker.rush.dto;

import com.tasker.rush.entity.Project;

public record ProjectResponse(
        Long id,
        String title,
        String description
) {

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }
}