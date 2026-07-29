<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('news_articles')->insert([
            [
                'title' => 'Supreme Court Verdict on Electoral Bonds',
                'content' => 'The Supreme Court struck down the Electoral Bond scheme as unconstitutional, citing the right to information of voters. This landmark judgement affects political funding transparency in India.',
                'category' => 'Daily',
                'pdf_url' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Weekly Recap: RBI Monetary Policy & G20 Summit',
                'content' => 'This week saw major updates in the economy with the RBI keeping the repo rate unchanged at 6.5%. Also, the G20 preparations were in full swing...',
                'category' => 'Weekly',
                'pdf_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Examverse AI Monthly Magazine - July 2026',
                'content' => 'Comprehensive coverage of all national and international events for the month of July. Perfect for UPSC revision.',
                'category' => 'Monthly',
                'pdf_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ]
        ]);
    }
}
