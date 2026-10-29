
from flask import Flask, render_template, request, jsonify
from algorithms.planner import plan_delivery

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Delivery Drone Flight Planner API is running!"
    })


@app.route("/api/plan", methods=["POST"])
def create_plan():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Request body must be a JSON object."
        }), 400

    try:
        result = plan_delivery(
            grid=data.get("grid"),
            locations=data.get("locations"),
            algorithm=data.get("algorithm", "held_karp")
        )

        if result["status"] == "error":
            return jsonify(result), 422

        return jsonify(result)

    except (ValueError, TypeError) as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)
