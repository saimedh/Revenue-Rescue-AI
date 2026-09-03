"""Load the baseline model and predict a recovery probability for one payment."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBClassifier


ROOT = Path(__file__).parent
MODEL = ROOT / "models" / "recovery_xgb.json"


def predict(payload: dict[str, object]) -> float:
    """Predict with a model trained from the synthetic dataset.

    The production API currently uses a deterministic lightweight scorer for its
    demo mode; this helper is the upgrade path when the model is hosted.
    """
    if not MODEL.exists():
        raise FileNotFoundError(f"Model not found: {MODEL}. Run train.py first.")
    model = XGBClassifier()
    model.load_model(MODEL)
    frame = pd.DataFrame([payload]).drop(columns=["payment_id", "customer_id"], errors="ignore")
    categorical = ["failure_reason", "payment_method"]
    preprocessor = ColumnTransformer(
        [("categorical", OneHotEncoder(handle_unknown="ignore"), categorical)],
        remainder="passthrough",
    )
    # Refit encoding for a small standalone helper; training uses the same feature ordering.
    transformed = preprocessor.fit_transform(frame)
    return float(model.predict_proba(transformed)[:, 1][0])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--amount", type=float, default=50000)
    parser.add_argument("--failure-reason", default="insufficient_funds")
    parser.add_argument("--payment-method", default="upi")
    args = parser.parse_args()
    print(predict({
        "amount": args.amount,
        "failure_reason": args.failure_reason,
        "payment_method": args.payment_method,
        "retry_count": 1,
        "customer_lifetime_value": 120000,
        "previous_success_rate": 0.91,
        "previous_recovery_rate": 0.78,
        "hour": 19,
        "day_of_week": 2,
    }))