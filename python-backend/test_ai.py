from ai_service import generate_ai_tutor_response, generate_ai_mock_test, generate_daily_quiz
import json

def test_all():
    print("Testing AI Tutor...")
    try:
        tutor_res = generate_ai_tutor_response("Explain Indian Constitution in simple language.", "Polity", "UPSC", "English")
        print("Tutor response length:", len(tutor_res))
        print("Tutor response preview:", tutor_res[:100], "...")
    except Exception as e:
        print("Tutor failed:", e)
        
    print("\nTesting Mock Test...")
    try:
        mock_res = generate_ai_mock_test("UPSC", "Geography", "Physical Geography", "medium", 10, "English")
        # Validate json
        data = json.loads(mock_res)
        print("Mock Test Questions Count:", len(data.get("questions", [])))
    except Exception as e:
        print("Mock test failed:", e)
        print("Raw string:", mock_res if 'mock_res' in locals() else 'None')

    print("\nTesting Daily Quiz...")
    try:
        quiz_res = generate_daily_quiz()
        data = json.loads(quiz_res)
        print("Daily Quiz Questions Count:", len(data))
    except Exception as e:
        print("Daily Quiz failed:", e)
        print("Raw string:", quiz_res if 'quiz_res' in locals() else 'None')

if __name__ == "__main__":
    test_all()
