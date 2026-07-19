package com.tasker.rush.dto;

import com.tasker.rush.entity.TaskStatus;

public record UpdateTaskRequest(
        String title,
        String description,
        TaskStatus status
) {
}
