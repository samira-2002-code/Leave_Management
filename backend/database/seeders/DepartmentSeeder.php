<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Ressources Humaines',
                'description' => 'Département des ressources humaines',
            ],
            [
                'name' => 'Informatique',
                'description' => 'Département informatique',
            ],
            [
                'name' => 'Pédagogie',
                'description' => 'Département pédagogique et formateurs',
            ],
            [
                'name' => 'Administration',
                'description' => 'Département administratif',
            ],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(
                ['name' => $department['name']],
                $department
            );
        }
    }
}