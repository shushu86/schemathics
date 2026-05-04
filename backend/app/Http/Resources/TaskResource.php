<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => self::formatStatus($this->status),
            'stored_priority' => self::formatPriority($this->stored_priority ?? $this->priority),
            'effective_priority' => self::formatPriority($this->effective_priority),
            'due_date' => $this->due_date?->format('M j Y, H:i'),
            'created_at' => $this->created_at?->format('M j Y, H:i'),
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
