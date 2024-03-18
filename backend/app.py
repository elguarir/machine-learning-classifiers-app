from flask import Flask, request, jsonify
from flower_classifier_trees import FlowerClassifierTrees

clfTrees = FlowerClassifierTrees()
app = Flask(__name__)


@app.route("/trees/train", methods=["GET"])
def train_flower_classifier():
    accuracy = clfTrees.train()
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

    if not hasattr(clfTrees, "clf"):
        return jsonify({"error": "Model has not been trained yet"}), 400

    prediction = clfTrees.predict(
        [sepal_length, sepal_width, petal_length, petal_width]
    )
    print("prediction", prediction)

    return jsonify({"class": prediction})


if __name__ == "__main__":
    app.run(debug=True)
