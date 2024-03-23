# Machine Learning Classifiers

This project contains machine learning classifiers for predicting flower types and Titanic survival.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is written in Python and uses Flask for the web server. It contains three classifiers:

- Flower Classifier using Decision Trees ([`FlowerClassifierTrees`](backend/flower_classifier.py))
- Flower Classifier using Random Forest ([`FlowerClassifierRandomForest`](backend/flower_classifier.py))
- Titanic Survival Classifier ([`TitanicSurvivalClassifier`](backend/titanic_classifier.py))

The backend server provides endpoints for training the classifiers and making predictions.

### Frontend

The frontend is a React application written in TypeScript. It provides a user interface for interacting with the classifiers.

## Demo
![demo](https://github.com/elguarir/flower-classification-app/assets/120427922/29d36222-efba-4d57-8e15-7de8837dfb7a)

## Getting Started

1. Install the Python dependencies for the backend:

```sh
cd backend
pip install -r requirements.txt
```

2. Start the backend server:

```sh
python app.py
```

3. Install the JavaScript dependencies for the frontend:

```sh
cd frontend
npm install
```

4. Start the frontend server:

```sh
npm run dev
```

Now you can open your browser and navigate to http://localhost:5173 to interact with the application.
