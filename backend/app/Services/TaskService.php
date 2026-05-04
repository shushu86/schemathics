<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    public function getAllTasks(array $query_params): Collection
    {
        if (($query_params['filter_by'] ?? null) === 'status'
            && isset($query_params['status'])
            && in_array(strtolower((string) $query_params['status']), ['todo', 'in_progress', 'done'], true)) {
            $status = strtolower((string) $query_params['status']);
            return Task::query()
                ->where('status', $status)
                ->orderBy('due_date', 'asc')
                ->get()
                ->each(function (Task $task): void {
                    $this->attachStoredPriority($task);
                    $this->attachEffectivePriority($task);
                });
        }

        if (($query_params['filter_by'] ?? null) === 'priority'
            && isset($query_params['priority'])
            && in_array(strtolower((string) $query_params['priority']), ['low', 'medium', 'high'], true)) {
            $priority = strtolower((string) $query_params['priority']);
            return Task::query()
                ->where('priority', $priority)
                ->orderBy('due_date', 'asc')
                ->get()
                ->each(function (Task $task): void {
                    $this->attachStoredPriority($task);
                    $this->attachEffectivePriority($task);
                });
        }


        $column = strtolower((string) ($query_params['order_by'] ?? $query_params['order'] ?? 'due_date'));
        $direction = strtolower((string) ($query_params['direction'] ?? 'asc'));

        if (! in_array($column, ['due_date', 'created_at'], true)) {
            $column = 'due_date';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        return Task::query()
            ->orderBy($column, $direction)
            ->get()
            ->each(function (Task $task): void {
                $this->attachStoredPriority($task);
                $this->attachEffectivePriority($task);
            });
    }

    public function getTaskById(int $id): Task
    {
        $task = Task::query()->findOrFail($id);
        $this->attachStoredPriority($task);
        $this->attachEffectivePriority($task);

        return $task;
    }

    private function attachStoredPriority(Task $task): void
    {
        $task->setAttribute('stored_priority', $task->priority);
        unset($task->priority);
    }

    /**
     * Due within 24 hours and not completed → treat as high priority for ordering/UX.
     */
    private function attachEffectivePriority(Task $task): void
    {
        $task->setAttribute(
            'effective_priority',
            $this->resolveEffectivePriority($task)
        );
    }

    private function resolveEffectivePriority(Task $task): string
    {
        if ($task->status === 'done') {
            return (string) $task->stored_priority;
        }

        $due = $task->due_date;
        if ($due !== null && $due <= now()->addHours(24)) {
            return 'high';
        }

        return (string) $task->stored_priority;
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        $task = $task->refresh();
        $this->attachStoredPriority($task);
        $this->attachEffectivePriority($task);

        return $task;
    }

    public function deleteTask(Task $task): void
    {
        $task->delete();
    }
}
