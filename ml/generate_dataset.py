"""Generate a realistic synthetic payment recovery dataset for the MVP model."""

from __future__ import annotations

import csv
import random
from pathlib import Path


FAILURE_REASONS = [
    ("insufficient_funds", 0.82),
    ("card_declined", 0.63),
    ("expired_method", 0.76),
    ("network_error", 0.71),
    ("renewal_failed", 0.55),
]
PAYMENT_METHODS = ["upi", "card", "netbanking", "wallet"]


def generate_row(index: int) -> dict[str, object]:
    amount = round(random.lognormvariate(9.5, 0.8), 2)
    reason, baseline = random.choice(FAILURE_REASONS)
    method = random.choice(PAYMENT_METHODS)
    retry_count = random.choices([0, 1, 2, 3], weights=[18, 48, 25, 9])[0]
    lifetime_value = round(random.uniform(8_000, 320_000), 2)
    previous_success_rate = round(random.betavariate(14, 3), 4)
    previous_recovery_rate = round(random.betavariate(8, 3), 4)
    hour = random.choices(range(24), weights=[1, 1, 1, 1, 1, 2, 3, 5, 6, 5, 4, 3, 3, 3, 4, 5, 7, 9, 11, 10, 7, 4, 2, 1])[0]
    day_of_week = random.randrange(7)
    time_bonus = 0.06 if hour in {18, 19, 20} else -0.03 if hour < 7 else 0
    method_bonus = 0.04 if method == "upi" else -0.02 if method == "card" else 0
    logit = (
        -1.25
        + baseline
        + previous_success_rate * 1.45
        + previous_recovery_rate * 0.8
        + time_bonus
        + method_bonus
        - retry_count * 0.24
        - min(amount / 250_000, 1) * 0.22
    )
    probability = 1 / (1 + pow(2.71828, -logit + 1.9))
    recovered = int(random.random() < probability)
    return {
        "payment_id": f"PAY_{index:06d}",
        "customer_id": f"CUS_{random.randint(1, 850):04d}",
        "amount": amount,
        "failure_reason": reason,
        "payment_method": method,
        "retry_count": retry_count,
        "customer_lifetime_value": lifetime_value,
        "previous_success_rate": previous_success_rate,
        "previous_recovery_rate": previous_recovery_rate,
        "hour": hour,
        "day_of_week": day_of_week,
        "recovered": recovered,
    }


def main() -> None:
    random.seed(42)
    output = Path(__file__).parent / "data" / "synthetic_payments.csv"
    output.parent.mkdir(parents=True, exist_ok=True)
    rows = [generate_row(index) for index in range(1, 5001)]
    with output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} synthetic payments to {output}")


if __name__ == "__main__":
    main()