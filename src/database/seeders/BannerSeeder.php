<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::create([
            'image' => 'https://picsum.photos/seed/home-large/1200/600',
            'title' => 'Colección Verano 2026',
            'subtitle' => 'Descubre las últimas tendencias',
            'link' => '/category/praesentium-rerum',
            'position_h' => 'left',
            'position_v' => 'center',
            'sort_order' => 1,
        ]);

        Banner::create([
            'image' => 'https://picsum.photos/seed/home-sm1/600/290',
            'title' => 'Nuevos Productos',
            'position_h' => 'center',
            'position_v' => 'center',
            'sort_order' => 2,
        ]);

        Banner::create([
            'image' => 'https://picsum.photos/seed/home-sm2/600/290',
            'subtitle' => 'Hasta 40% de descuento',
            'link' => '/category/sit-ullam',
            'position_h' => 'right',
            'position_v' => 'bottom',
            'sort_order' => 3,
        ]);

        Banner::create([
            'image' => 'https://picsum.photos/seed/home-lg2/1200/600',
            'title' => 'Ofertas Especiales',
            'subtitle' => 'No te lo pierdas',
            'link' => '/category/qui-quo',
            'position_h' => 'center',
            'position_v' => 'top',
            'sort_order' => 4,
        ]);
    }
}
