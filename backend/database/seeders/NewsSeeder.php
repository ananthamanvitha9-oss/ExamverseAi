<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $news = [
            [
                'title' => 'India\'s G20 Presidency: Key Outcomes and Global Impact',
                'content' => "India's presidency of the G20 culminated in a historic consensus on the New Delhi Leaders' Declaration. Key achievements included the admission of the African Union as a permanent member, the launch of the Global Biofuels Alliance, and the ambitious India-Middle East-Europe Economic Corridor (IMEC). This presidency marked a significant shift in global geopolitics, positioning India as a leading voice for the Global South.",
                'category' => 'Monthly',
                'pdf_url' => null,
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'title' => 'RBI Monetary Policy Committee Maintains Status Quo on Repo Rate',
                'content' => "The Reserve Bank of India (RBI) Monetary Policy Committee (MPC) unanimously decided to keep the policy repo rate unchanged at 6.5%. The decision reflects the central bank's focus on withdrawal of accommodation to ensure that inflation progressively aligns with the target, while supporting growth. Retail inflation (CPI) has shown signs of moderation, but volatile food prices remain a concern.",
                'category' => 'Weekly',
                'pdf_url' => null,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'ISRO Successfully Launches Aditya-L1 Solar Mission',
                'content' => "The Indian Space Research Organisation (ISRO) successfully launched Aditya-L1, India's first space-based observatory class solar mission. Placed in a halo orbit around the Lagrange point 1 (L1) of the Sun-Earth system, the spacecraft will study the solar corona, solar emissions, solar winds and flares, and Coronal Mass Ejections (CMEs). This mission follows the historic success of Chandrayaan-3.",
                'category' => 'Daily',
                'pdf_url' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Parliament Passes the Digital Personal Data Protection Act',
                'content' => "The Parliament has cleared the Digital Personal Data Protection (DPDP) Bill, setting a new framework for privacy and data governance in India. The law mandates explicit consent for data processing, establishes the Data Protection Board of India, and imposes heavy penalties for data breaches. It applies to digital personal data processed within India and internationally if offering goods/services to individuals in India.",
                'category' => 'Weekly',
                'pdf_url' => null,
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'COP28 Summit: Global Stocktake and Fossil Fuel Transition',
                'content' => "The COP28 climate summit in Dubai concluded with a landmark agreement calling for a \"transition away from fossil fuels in energy systems.\" It was the first time fossil fuels were explicitly targeted in a COP decision. Countries also agreed to operationalize the Loss and Damage Fund to help vulnerable nations cope with the impacts of climate change.",
                'category' => 'Monthly',
                'pdf_url' => null,
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ]
        ];

        DB::table('news_articles')->insert($news);
    }
}
