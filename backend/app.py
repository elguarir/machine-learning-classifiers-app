from flask import Flask, request, jsonify
from flower_classifier import FlowerClassifierTrees
from flower_classifier import FlowerClassifierRandomForest
from titanic_classifier import TitanicSurvivalClassifier
from flask_cors import CORS

clfTrees = FlowerClassifierTrees()
clfForest = FlowerClassifierRandomForest()
titanic_classifier = TitanicSurvivalClassifier()
app = Flask(__name__)
CORS(app)


@app.route("/trees/train", methods=["GET"])
def train_flower_classifier():
    accuracy = clfTrees.train()
    return jsonify({"accuracy": accuracy})


@app.route("/random_forest/train", methods=["GET"])
def train_flower_classifier_forest():
    accuracy = clfForest.train()
    return jsonify({"accuracy": accuracy})


@app.route("/trees/classify", methods=["POST"])
def classify_flower():
    data = request.get_json()
    sepal_length = data.get("sepal_length")
    sepal_width = data.get("sepal_width")
    petal_length = data.get("petal_length")
    petal_width = data.get("petal_width")

    if (
        sepal_length is None
        or sepal_width is None
        or petal_length is None
        or petal_width is None
    ):
        return jsonify({"error": "Missing features"}), 400

    if not hasattr(clfTrees, "classifier"):
        return jsonify({"error": "Model has not been trained yet"}), 400

    prediction = clfTrees.predict(
        [sepal_length, sepal_width, petal_length, petal_width]
    )
    print("prediction", prediction)

    return jsonify({"class": prediction})


@app.route("/random_forest/classify", methods=["POST"])
def classify_flower_forest():
    data = request.get_json()
    sepal_length = data.get("sepal_length")
    sepal_width = data.get("sepal_width")
    petal_length = data.get("petal_length")
    petal_width = data.get("petal_width")

    if (
        sepal_length is None
        or sepal_width is None
        or petal_length is None
        or petal_width is None
    ):
        return jsonify({"error": "Missing features"}), 400

    if not hasattr(clfForest, "classifier"):
        return jsonify({"error": "Model has not been trained yet"}), 400

    prediction = clfForest.predict(
        [sepal_length, sepal_width, petal_length, petal_width]
    )
    print("prediction", prediction)

    return jsonify({"class": prediction})


# titanic classifier
def map_sex(sex):
    return 0 if sex.lower() == "male" else 1


@app.route("/titanic/train", methods=["GET"])
def train_titanic():
    titanic_classifier.train()
    accuracy = titanic_classifier.accuracy
    titanic_classifier.save_model()
    return jsonify(
        {"message": "Model trained and saved successfully.", "accuracy": accuracy}
    )


@app.route("/titanic/load", methods=["GET"])
def load_titanic():
    titanic_classifier.load_model()
    return jsonify({"message": "Model loaded successfully."})


@app.route("/titanic/predict", methods=["POST"])
def predict_titanic():
    data = request.get_json()
    Pclass = float(data["Pclass"])
    Sex = map_sex(data["Sex"])
    Age = int(data["Age"])
    SibSp = float(data["SibSp"])
    result = titanic_classifier.predict([[Pclass, Sex, Age, SibSp]])[0]
    result = "Survived" if result == 1 else "Death"
    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True)
