<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #3b82f6;
        }
        .content {
            color: #333333;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background-color: #3b82f6;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Examverse AI! 🚀</h1>
        </div>
        <div class="content">
            <p>Hi {{ $user->full_name }},</p>
            <p>We are thrilled to have you join Examverse AI. Your journey to cracking your dream exam starts today.</p>
            <p>Here's what you can do right now:</p>
            <ul>
                <li>Talk to your Voice-Enabled AI Tutor</li>
                <li>Generate an unlimited number of Mock Tests</li>
                <li>Chat with other aspirants in the Global Study Room</li>
            </ul>
            <center>
                <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/dashboard" class="btn">Go to Dashboard</a>
            </center>
        </div>
    </div>
</body>
</html>
