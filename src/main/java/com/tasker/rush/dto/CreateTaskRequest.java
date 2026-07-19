package com.tasker.rush.dto;

import com.tasker.rush.entity.TaskStatus;

public record CreateTaskRequest(
        Long projectId,
        String title,
        String description,
        TaskStatus status
) {
}
