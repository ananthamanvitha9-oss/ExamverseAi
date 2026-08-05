<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CourseEnrollment;
use App\Models\LessonCompletion;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    public function completeLesson(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'time_spent_minutes' => 'required|integer|min:1'
        ]);

        $user = auth()->user();
        
        // Find the course this lesson belongs to
        $lesson = Lesson::with('chapter.course')->findOrFail($request->lesson_id);
        $courseId = $lesson->chapter->course_id;

        // Ensure user is enrolled
        CourseEnrollment::firstOrCreate([
            'user_id' => $user->id,
            'course_id' => $courseId
        ]);

        // Mark lesson complete or update time
        $completion = LessonCompletion::firstOrNew([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id
        ]);
        
        $completion->time_spent_minutes += $request->time_spent_minutes;
        $completion->save();

        // Gamification: Add 10 points for completing a lesson
        $user->points += 10;
        $user->save();

        return response()->json([
            'message' => 'Lesson completed successfully',
            'points_earned' => 10
        ]);
    }

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        
        // 1. Total Hours Studied
        $totalMinutes = LessonCompletion::where('user_id', $user->id)->sum('time_spent_minutes');
        $hoursStudied = round($totalMinutes / 60, 1);

        // 2. Weekly Progress (just mock a small diff based on recent activity for now)
        $recentMinutes = LessonCompletion::where('user_id', $user->id)
            ->where('updated_at', '>=', now()->subDays(7))
            ->sum('time_spent_minutes');
        $weeklyProgress = $recentMinutes > 0 ? '+12%' : '0%'; // Simplified

        // 3. Completed Chapters
        // A chapter is completed if all its lessons are completed.
        // For simplicity in the dashboard, we'll just count total completed lessons for now, or just use a proxy.
        $completedLessonsCount = LessonCompletion::where('user_id', $user->id)->count();

        // 4. Active Enrollments (Continue Learning)
        $enrollments = CourseEnrollment::where('user_id', $user->id)->pluck('course_id');
        $courses = Course::whereIn('id', $enrollments)->with(['chapters.lessons'])->get();

        $activeCourses = [];
        foreach ($courses as $course) {
            $totalCourseLessons = 0;
            foreach ($course->chapters as $chapter) {
                $totalCourseLessons += $chapter->lessons->count();
            }

            // Find completed lessons for this course
            $completedInCourse = LessonCompletion::where('user_id', $user->id)
                ->whereIn('lesson_id', function ($query) use ($course) {
                    $query->select('lessons.id')
                        ->from('lessons')
                        ->join('chapters', 'lessons.chapter_id', '=', 'chapters.id')
                        ->where('chapters.course_id', $course->id);
                })->count();

            $progress = $totalCourseLessons > 0 ? round(($completedInCourse / $totalCourseLessons) * 100) : 0;
            
            // Get the last accessed chapter name (simplified, just get first chapter)
            $currentChapter = $course->chapters->first()->title ?? 'Introduction';

            $activeCourses[] = [
                'id' => $course->id,
                'title' => $course->title,
                'chapter' => $currentChapter,
                'progress' => $progress
            ];
        }

        return response()->json([
            'stats' => [
                'hours_studied' => $hoursStudied . ' hrs',
                'weekly_progress' => $weeklyProgress,
                'completed_lessons' => $completedLessonsCount, // Replaced completed chapters with lessons
            ],
            'active_courses' => $activeCourses
        ]);
    }
}
