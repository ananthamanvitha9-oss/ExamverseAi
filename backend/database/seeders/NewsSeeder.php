<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsSeeder extends Seeder
{
    public function run()
    {
        $articles = [
            [
                'title' => 'Supreme Court Verdict on Electoral Bonds',
                'category' => 'Daily',
                'content' => 'In a landmark judgement, the Supreme Court has struck down the Electoral Bonds scheme, calling it unconstitutional. This is a crucial topic for Polity in UPSC.',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2)
            ],
            [
                'title' => 'RBI Guidelines on Digital Lending',
                'category' => 'Daily',
                'content' => 'The Reserve Bank of India issued new guidelines to regulate digital lending platforms to prevent customer exploitation. Important for IBPS and Economy.',
                'created_at' => now()->subHours(5),
                'updated_at' => now()->subHours(5)
            ],
            [
                'title' => 'Weekly Recap: International Relations',
                'category' => 'Weekly',
                'content' => 'This week saw major shifts in geopolitics. The G20 summit concluded with a joint declaration on climate financing, while bilateral talks between India and the US strengthened defense ties.',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2)
            ],
            [
                'title' => 'Monthly Digest: Environment & Ecology',
                'category' => 'Monthly',
                'content' => 'The past month highlighted severe climate challenges, including record-breaking heatwaves in northern India and the introduction of the new National Biodiversity Framework.',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10)
            ],
            [
                'title' => 'ISRO successfully launches Next-Gen Satellite',
                'category' => 'Daily',
                'content' => 'The Indian Space Research Organisation (ISRO) successfully placed the latest communication satellite into orbit. A must-read for Science & Tech.',
                'created_at' => now()->subHours(8),
                'updated_at' => now()->subHours(8)
            ],
            [
                'title' => 'Weekly Economics Roundup',
                'category' => 'Weekly',
                'content' => 'Inflation data released this week indicates a cooling trend, while GST collections hit a new record high. Let us analyze what this means for the fiscal deficit.',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3)
            ]
        ];

        DB::table('news_articles')->insert($articles);
    }
}
