<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'super@admin.com',
                'password' => bcrypt('password'),
            ],
        ];
        foreach($users as $user) {
            $exist = User::where('email',$user['email'])->first();
            if(!$exist) {
                User::create($user);
            }
        }
    }
}
