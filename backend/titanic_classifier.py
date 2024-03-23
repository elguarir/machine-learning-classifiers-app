import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import pickle

class TitanicSurvivalClassifier:
    def __init__(self, filename='titanic.csv'):
        self.filename = filename
        self.df = None
        self.best_model = None
        self.accuracy = None

    def load_data(self):
        self.df = pd.read_csv(self.filename)

    def preprocess_data(self):
        self.df.rename(columns={'Siblings/Spouses Aboard': 'SibSp'}, inplace=True)
        self.df = self.df[['Survived', 'Pclass', 'Sex', 'Age', 'SibSp']]
        sex_mapping = {'male': 0, 'female': 1}
        self.df['Sex'] = self.df['Sex'].map(sex_mapping)
        self.df.fillna(self.df.mean(), inplace=True)

    def train(self):
        self.load_data()
        self.preprocess_data()

        X = self.df[['Pclass', 'Sex', 'Age', 'SibSp']]
        y = self.df['Survived']
        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

        dt1 = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
        dt1.fit(x_train, y_train)

        dt2 = DecisionTreeClassifier(max_depth=3, criterion='entropy')
        dt2.fit(x_train, y_train)

        y_pred_dt1 = dt1.predict(x_test)
        y_pred_dt2 = dt2.predict(x_test)

        accuracy_dt1 = accuracy_score(y_test, y_pred_dt1)
        accuracy_dt2 = accuracy_score(y_test, y_pred_dt2)

        if accuracy_dt1 > accuracy_dt2:
            self.best_model = dt1
            self.accuracy = accuracy_dt1
        else:
            self.best_model = dt2
            self.accuracy = accuracy_dt2

    def save_model(self, filename='titanic_dt.pkl'):
        with open(filename, 'wb') as f:
            pickle.dump(self.best_model, f)

    def load_model(self, filename='titanic_dt.pkl'):
        with open(filename, 'rb') as f:
            self.best_model = pickle.load(f)

    def predict(self, data):
        if self.best_model is None:
            raise ValueError("Model not trained or loaded.")

        return self.best_model.predict(data)