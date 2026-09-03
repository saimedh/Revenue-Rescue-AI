"""Train a baseline XGBoost recovery probability model."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBClassifier


ROOT = Path(__file__).parent
DATASET = ROOT / "data" / "synthetic_payments.csv"
MODEL = ROOT / "models" / "recovery_xgb.json"


def main() -> None:
    if not DATASET.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET}. Run generate_dataset.py first.")

    frame = pd.read_csv(DATASET)
    target = frame.pop("recovered")
    frame = frame.drop(columns=["payment_id", "customer_id"])
    categorical = ["failure_reason", "payment_method"]
    numeric = [column for column in frame.columns if column not in categorical]
    preprocessor = ColumnTransformer(
        [("categorical", OneHotEncoder(handle_unknown="ignore"), categorical)],
        remainder="passthrough",
    )
    features = preprocessor.fit_transform(frame)
    train_x, test_x, train_y, test_y = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )
    model = XGBClassifier(
        n_estimators=120,
        max_depth=4,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        eval_metric="logloss",
        random_state=42,
    )
    model.fit(train_x, train_y)
    auc = roc_auc_score(test_y, model.predict_proba(test_x)[:, 1])
    MODEL.parent.mkdir(parents=True, exist_ok=True)
    model.save_model(MODEL)
    (MODEL.parent / "metadata.json").write_text(
        json.dumps({"roc_auc": round(float(auc), 4), "features": numeric + categorical}, indent=2),
        encoding="utf-8",
    )
    print(f"Saved {MODEL} · validation ROC-AUC {auc:.3f}")


if __name__ == "__main__":
    main()