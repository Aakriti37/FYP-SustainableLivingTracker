# ml-service/train_model.py

# Run this ONCE to train and save XGBoost model
# Command: python train_model.py
# Output: eco_model.json + model_artifacts.pkl


import pandas as pd
import numpy as np
import ast
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import xgboost as xgb


# 1. Load Dataset
print("=" * 60)
print("  SustainableLivingTracker - XGBoost Model Training")
print("=" * 60)
print("\n[1/6] Loading dataset...")

df = pd.read_csv("Carbon_Emission.csv")
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")


# 2. Create Target Variable
# Classify CarbonEmission into Low / Medium / High
print("\n[2/6] Creating target variable...")
q33 = df["CarbonEmission"].quantile(0.33)
q66 = df["CarbonEmission"].quantile(0.66)
print(f"Low threshold: <= {q33:.0f} kg")
print(f"Medium threshold: <= {q66:.0f} kg")
print(f"High threshold: > {q66:.0f} kg")


def categorize_emission(val):
    if val <= q33: return 0     # Low
    elif val <= q66: return 1   # Medium
    else: return 2      # High


df["EmissionLevel"] = df["CarbonEmission"].apply(categorize_emission)
dist = df["EmissionLevel"].value_counts().rename({0: "Low", 1: "Medium", 2: "High"})
print(f"\n Distribution:\n{dist.to_string()}")

# 3. Feature Engineering
print("\n[3/6] Engineering features...")

# Recycling column is stored as string list e.g. "['Metal', 'Paper']"
def parse_list_col(val):
    try:
        return ast.literal_eval(val)
    except:
        return []
    
df["Recycling_count"] = df["Recycling"].apply(parse_list_col).apply(len)
df["Cooking_count"] = df["Cooking_With"].apply(parse_list_col).apply(len)


# Fill missing Vehicle Type (NaN means no vehicle)
df["Vehicle Type"] = df["Vehicle Type"].fillna("none")

print("Recycling_count and Cooking_count features created")
print("Vehicle Type NaN filled with 'none'")


# 4. Define Feature Columns
CATEGORICAL_COLS = [
    "Body Type",
    "Sex",
    "Diet",
    "How Often Shower",
    "Heating Energy Source",
    "Transport",
    "Vehicle Type",
    "Social Activity",
    "Frequency of Traveling by Air",
    "Waste Bag Size",
    "Energy efficiency",
]

NUMERICAL_COLS = [
    "Monthly Grocery Bill",
    "Vehicle Monthly Distance Km",
    "Waste Bag Weekly Count",
    "How Long TV PC Daily Hour",
    "How Many New Clothes Monthly",
    "How Long Internet Daily Hour",
    "Recycling_count",
    "Cooking_count",
]


# 5. Encode and Scale
print("\n[4/6] Encoding categorical columns...")
encoders = {}
for col in CATEGORICAL_COLS:
    le = LabelEncoder()
    df[col + "_enc"] = le.fit_transform(df[col].astype(str))
    encoders[col] = le
    print(f"{col}: {list(le.classes_)}")


encoded_cat_cols = [col + "_enc" for col in CATEGORICAL_COLS]
feature_cols = encoded_cat_cols + NUMERICAL_COLS

X = df[feature_cols].copy()
y = df["EmissionLevel"]


print("\n[5/6] Scaling numerical columns and splitting data...")
scaler = StandardScaler()
X[NUMERICAL_COLS] = scaler.fit_transform(X[NUMERICAL_COLS])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Train: {len(X_train)} samples")
print(f"Test: {len(X_test)} samples")


# 6. Train XGBoost
print("\n[6/6] Training XGBoost classifier...")
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="mlogloss",
    random_state=42,
    verbosity=0,
)
model.fit(X_train, y_train)


# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("\n" + "=" * 55)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("=" * 55)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))

print("Top 10 Important Features:")
importance_df = pd.DataFrame({
    "feature": feature_cols,
    "importance": model.feature_importances_,
}).sort_values("importance", ascending=False)
print(importance_df.head(10).to_string(index=False))


# Save
print("\nSaving model artifacts...")
model.save_model("eco_model.json")

artifacts = {
    "encoders": encoders,
    "scaler": scaler,
    "feature_cols": feature_cols,
    "categorical_cols": CATEGORICAL_COLS,
    "numerical_cols": NUMERICAL_COLS,
    "encoded_cat_cols": encoded_cat_cols,
    "q33": q33,
    "q66": q66,
}
with open("model_artifacts.pkl", "wb") as f:
    pickle.dump(artifacts, f)

print("\n Training Complete!")
print(" eco_model.json - XGBoost model")
print(" model_artifacts.pkl - encoders, scaler, metadata")
print("\nNext step: python app.py")






