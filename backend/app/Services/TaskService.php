<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    public function getAllTasks(): Collection
    {
        return Task::query()->latest()->get();
    }

    public function getTaskById(int $id): Task
    {
        return Task::query()->findOrFail($id);
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->refresh();
    }

    public function deleteTask(Task $task): void
    {
        $task->delete();
    }
}
