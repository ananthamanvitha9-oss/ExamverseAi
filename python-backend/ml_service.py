import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Mock data generation for training a simple model
# Features: [study_hours, previous_score]
# Target: [predicted_mock_score]
data = {
    'study_hours': [10, 20, 30, 40, 50, 15, 25, 35, 45, 5],
    'previous_score': [40, 50, 60, 70, 80, 45, 55, 65, 75, 35],
    'mock_score': [45, 58, 65, 78, 85, 50, 62, 70, 82, 38]
}

df = pd.DataFrame(data)

X = df[['study_hours', 'previous_score']]
y = df['mock_score']

# Train a very basic Linear Regression model
model = LinearRegression()
model.fit(X, y)

def predict_score(study_hours: float, previous_score: float) -> float:
    """
    Predicts the next mock score based on study hours and previous score using Scikit-learn.
    """
    input_data = pd.DataFrame({'study_hours': [study_hours], 'previous_score': [previous_score]})
    prediction = model.predict(input_data)
    return round(prediction[0], 2)
