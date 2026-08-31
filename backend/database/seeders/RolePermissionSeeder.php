<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'create leave request',
            'view own leave requests',
            'view team leave requests',
            'approve manager leave request',
            'reject manager leave request',
            'approve hr leave request',
            'reject hr leave request',
            'manage leave types',
            'manage departments',
            'manage users',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $employee = Role::firstOrCreate([
            'name' => 'employee',
            'guard_name' => 'web',
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);

        $hr = Role::firstOrCreate([
            'name' => 'hr',
            'guard_name' => 'web',
        ]);

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $employee->syncPermissions([
            'create leave request',
            'view own leave requests',
        ]);

        $manager->syncPermissions([
            'create leave request',
            'view own leave requests',
            'view team leave requests',
            'approve manager leave request',
            'reject manager leave request',
        ]);

        $hr->syncPermissions([
            'view team leave requests',
            'approve hr leave request',
            'reject hr leave request',
            'view reports',
        ]);

        $admin->syncPermissions(Permission::all());
    }
}