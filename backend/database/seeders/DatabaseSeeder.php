<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\AdminNotification;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CategorySeeder::class);
        $this->call(SizeSeeder::class);

        User::factory(1)->create();
        // AdminNotification::factory(10)->create();
        // Shop::factory(30)->create();
        // Product::factory(30)->create();
        // Purchase::factory(30)->create();
    }
}
