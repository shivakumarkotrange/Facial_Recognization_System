# train.py
import os
import json
import argparse
from pathlib import Path
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

from config import DATASET_DIR, MODEL_PATH, BATCH_SIZE, EPOCHS, LEARNING_RATE, IMG_SIZE, EMOTIONS
from emotion_model import build_cnn_model

def get_generators(dataset_dir: Path, batch_size: int):
    """
    Sets up ImageDataGenerators for train and validation data.
    """
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode="nearest"
    )

    val_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

    # Class labels from config matching FER2013 folders (lowercased/uppercased folders)
    # The folders in FER2013 are usually lowercase names
    classes_lower = [e.lower() for e in EMOTIONS]

    train_generator = train_datagen.flow_from_directory(
        directory=dataset_dir / "train",
        target_size=(IMG_SIZE, IMG_SIZE),
        color_mode="grayscale",
        batch_size=batch_size,
        class_mode="categorical",
        classes=classes_lower,
        shuffle=True
    )

    val_generator = val_datagen.flow_from_directory(
        directory=dataset_dir / "test",
        target_size=(IMG_SIZE, IMG_SIZE),
        color_mode="grayscale",
        batch_size=batch_size,
        class_mode="categorical",
        classes=classes_lower,
        shuffle=False
    )

    return train_generator, val_generator

def plot_and_save_curves(history, output_dir: Path):
    """Saves plots for training curves."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Accuracy Plot
    plt.figure(figsize=(8, 5))
    plt.plot(history.history["accuracy"], label="Train Accuracy")
    plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
    plt.title("Model Accuracy")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / "accuracy.png")
    plt.close()

    # Loss Plot
    plt.figure(figsize=(8, 5))
    plt.plot(history.history["loss"], label="Train Loss")
    plt.plot(history.history["val_loss"], label="Validation Loss")
    plt.title("Model Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / "loss.png")
    plt.close()

def main():
    parser = argparse.ArgumentParser(description="DeepFER Model Training")
    parser.add_argument("--epochs", type=int, default=EPOCHS)
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE)
    parser.add_argument("--lr", type=float, default=LEARNING_RATE)
    args = parser.parse_args()

    # Ensure output folders exist
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"Checking for dataset in: {DATASET_DIR}")
    if not (DATASET_DIR / "train").exists():
        print(f"❌ Dataset not found at: {DATASET_DIR}")
        print("Please place the FER2013 train/test directories inside dataset/FER2013/")
        return

    # Generators
    train_gen, val_gen = get_generators(DATASET_DIR, args.batch_size)

    # Build Model
    model = build_cnn_model()
    model.summary()

    # Optimizer
    optimizer = tf.keras.optimizers.Adam(learning_rate=args.lr)
    model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])

    # Callbacks
    checkpoint = ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    )
    early_stop = EarlyStopping(
        monitor="val_loss",
        patience=10,
        restore_best_weights=True,
        verbose=1
    )
    reduce_lr = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=5,
        min_lr=1e-6,
        verbose=1
    )

    # Training
    print("🚀 Starting training...")
    history = model.fit(
        train_gen,
        epochs=args.epochs,
        validation_data=val_gen,
        callbacks=[checkpoint, early_stop, reduce_lr],
        verbose=1
    )

    # Save final logs/curves
    plot_and_save_curves(history, MODEL_PATH.parent / "plots")
    
    # Save evaluation summary
    val_loss, val_acc = model.evaluate(val_gen)
    print(f"Training Complete! Best Validation Accuracy: {val_acc:.4f}")
    
    summary = {
        "final_val_accuracy": float(val_acc),
        "final_val_loss": float(val_loss),
        "epochs_run": len(history.history["accuracy"])
    }
    with open(MODEL_PATH.parent / "metrics.json", "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
