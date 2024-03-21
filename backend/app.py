from flask import Flask, request, jsonify
from flower_classifier import FlowerClassifierTrees
from flower_classifier import FlowerClassifierRandomForest
from flask_cors import CORS

clfTrees = FlowerClassifierTrees()
clfForest = FlowerClassifierRandomForest()
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


if __name__ == "__main__":
    app.run(debug=True)
