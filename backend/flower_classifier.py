from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


class FlowerClassifierTrees:
    def __init__(self):
        self.load_data()

    def load_data(self):
        self.iris = datasets.load_iris()
        self.X = self.iris.data
        self.y = self.iris.target

    def train(self):
        self.classifier = DecisionTreeClassifier()
        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y, test_size=0.5
        )
        self.classifier.fit(X_train, y_train)
        # get accuracy
        predictions = self.classifier.predict(X_test)
        self.accuracy = accuracy_score(y_test, predictions)
        return self.accuracy

    def predict(self, features):
        prediction_idx = self.classifier.predict([features])[0]
        prediction_label = self.iris.target_names[prediction_idx]
        return prediction_label


class FlowerClassifierRandomForest:
    def __init__(self):
        self.load_data()

    def load_data(self):
        self.iris = datasets.load_iris()
        self.X = self.iris.data
        self.y = self.iris.target

    def train(self):
        self.classifier = RandomForestClassifier()
        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y, test_size=0.5
        )
        self.classifier.fit(X_train, y_train)
        # get accuracy
        predictions = self.classifier.predict(X_test)
        self.accuracy = accuracy_score(y_test, predictions)
        return self.accuracy

    def predict(self, features):
        prediction_idx = self.classifier.predict([features])[0]
        prediction_label = self.iris.target_names[prediction_idx]
        return prediction_label