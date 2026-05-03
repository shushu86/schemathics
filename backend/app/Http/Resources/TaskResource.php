<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Return a plain JSON array for collections (see TaskController::getAllTasks).
     */
    public static $wrap = null;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => self::formatStatus($this->status),
            'priority' => self::formatPriority($this->priority),
            'due_date' => $this->due_date?->format('M j, Y'),
            'created_at' => $this->created_at?->format('M j, Y'),
        ];
    }

    private static function formatStatus(?string $value): string
    {
        return match ($value) {
            'todo' => 'Todo',
            'in_progress' => 'In Progress',
            'done' => 'Done',
            null, '' => '',
            default => str($value)->replace('_', ' ')->title()->value(),
        };
    }

    private static function formatPriority(?string $value): string
    {
        return match ($value) {
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            null, '' => '',
            default => str($value)->title()->value(),
        };
    }
}
