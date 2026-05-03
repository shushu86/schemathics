<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService)
    {
    }

    public function getAllTasks(): JsonResponse
    {
        $tasks = $this->taskService->getAllTasks();

        return response()->json(
            $tasks->map(
                fn (Task $task) => (new TaskResource($task))->resolve(request())
            )->values()->all()
        );
    }

    public function getTaskById(int $id): TaskResource
    {
        return new TaskResource($this->taskService->getTaskById($id));
    }

    public function createTask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:todo,in_progress,done'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ]);

        $task = Task::query()->create($validated);

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function updateTask(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:todo,in_progress,done'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ]);

        $updated = $this->taskService->updateTask($task, $validated);

        return new TaskResource($updated);
    }

    public function deleteTask(Task $task): JsonResponse
    {
        $this->taskService->deleteTask($task);

        return response()->json(status: 204);
    }
}
