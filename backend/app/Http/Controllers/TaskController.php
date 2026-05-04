<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService)
    {
    }

    public function getAllTasks(): JsonResponse
    {
        $query_params = request()->query();
        \Log::info('query_params', $query_params);
        $tasks = $this->taskService->getAllTasks($query_params);

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
            'status' => ['required', 'in:todo,in_progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date_format:Y-m-d\TH:i'],
        ]);
        $validated = $this->normalizeDueDate($validated);

        $task = Task::query()->create($validated);

        // Flat object like GET /tasks — JsonResource::response() would wrap in `data` and break the client.
        return response()->json(
            (new TaskResource($task))->resolve($request),
            201
        );
    }

    public function updateTask(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:todo,in_progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date_format:Y-m-d\TH:i'],
        ]);
        $validated = $this->normalizeDueDate($validated);

        $updated = $this->taskService->updateTask($task, $validated);

        return response()->json((new TaskResource($updated))->resolve($request));
    }

    public function deleteTask(Task $task): JsonResponse
    {
        $this->taskService->deleteTask($task);

        return response()->json(status: 204);
    }

    
    private function normalizeDueDate(array $validated): array
    {
        if (!array_key_exists('due_date', $validated)) {
            return $validated;
        }

        if ($validated['due_date'] === '' || $validated['due_date'] === null) {
            $validated['due_date'] = null;

            return $validated;
        }

        $validated['due_date'] = Carbon::createFromFormat('Y-m-d\TH:i', (string) $validated['due_date']);

        return $validated;
    }
}
