<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Congés payés',
                'description' => 'Congé annuel payé',
                'requires_document' => false,
                'is_half_day_allowed' => true,
                'default_days' => 22,
            ],
            [
                'name' => 'Congé maladie',
                'description' => 'Congé pour raison médicale',
                'requires_document' => true,
                'is_half_day_allowed' => true,
                'default_days' => 0,
            ],
            [
                'name' => 'Autorisation d’absence',
                'description' => 'Absence exceptionnelle autorisée',
                'requires_document' => false,
                'is_half_day_allowed' => true,
                'default_days' => 0,
            ],
            [
                'name' => 'Congé exceptionnel',
                'description' => 'Mariage, naissance ou autre événement exceptionnel',
                'requires_document' => true,
                'is_half_day_allowed' => false,
                'default_days' => 0,
            ],
        ];

        foreach ($types as $type) {
            LeaveType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}