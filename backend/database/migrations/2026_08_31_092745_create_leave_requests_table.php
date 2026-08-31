<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();

            // Employé qui fait la demande
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Type de congé
            $table->foreignId('leave_type_id')
                ->constrained('leave_types')
                ->restrictOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            // Nombre de jours demandés
            $table->decimal('duration', 5, 2);

            // full_day / half_day
            $table->enum('period', ['full_day', 'half_day'])
                ->default('full_day');

            $table->text('reason')->nullable();

            // Document médical ou justificatif
            $table->string('attachment')->nullable();

            // Workflow
            $table->enum('status', [
                'pending_manager',
                'pending_hr',
                'approved',
                'rejected',
                'cancelled'
            ])->default('pending_manager');

            // Manager N+1
            $table->foreignId('manager_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // RH
            $table->foreignId('hr_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Motif en cas de refus
            $table->text('rejection_reason')->nullable();

            // Pour les formateurs
            $table->foreignId('replacement_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->date('catch_up_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};