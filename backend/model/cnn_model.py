"""
DeepFER – CNN Model Architecture
==================================
Defines and builds the Convolutional Neural Network for facial emotion
recognition. Trained on FER2013 (48×48 grayscale, 7 classes).

Architecture:
  Input (48×48×1)
  → Conv2D(64) + BatchNorm + MaxPool + Dropout(0.25)
  → Conv2D(128) + BatchNorm + MaxPool + Dropout(0.25)
  → Conv2D(256) + BatchNorm + MaxPool + Dropout(0.25)
  → Flatten
  → Dense(512) + Dropout(0.5)
  → Dense(7, Softmax)
"""

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, BatchNormalization, Activation,
    Dropout, Flatten, Dense, Input
)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2


# ── Constants ────────────────────────────────────────────────────────────────
IMG_SIZE      = 48
NUM_CLASSES   = 7
LEARNING_RATE = 0.001
EMOTION_LABELS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]


def build_emotion_model(input_shape=(IMG_SIZE, IMG_SIZE, 1), num_classes=NUM_CLASSES) -> Sequential:
    """
    Build and compile the CNN emotion recognition model.

    Parameters
    ----------
    input_shape : tuple  – (height, width, channels)
    num_classes : int    – number of output emotion classes

    Returns
    -------
    model : tf.keras.Sequential  – compiled model ready for training
    """
    model = Sequential(name="DeepFER_CNN")

    # ── Block 1 ──────────────────────────────────────────────────
    model.add(Input(shape=input_shape))

    model.add(Conv2D(64, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(Conv2D(64, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # ── Block 2 ──────────────────────────────────────────────────
    model.add(Conv2D(128, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(Conv2D(128, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # ── Block 3 ──────────────────────────────────────────────────
    model.add(Conv2D(256, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(Conv2D(256, (3, 3), padding="same", kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # ── Classifier head ──────────────────────────────────────────
    model.add(Flatten())
    model.add(Dense(512, kernel_regularizer=l2(1e-4)))
    model.add(BatchNormalization())
    model.add(Activation("relu"))
    model.add(Dropout(0.5))

    model.add(Dense(num_classes, activation="softmax"))

    # ── Compile ──────────────────────────────────────────────────
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


def get_model_summary() -> str:
    """Return model summary as string."""
    model = build_emotion_model()
    lines = []
    model.summary(print_fn=lambda x: lines.append(x))
    return "\n".join(lines)


if __name__ == "__main__":
    model = build_emotion_model()
    model.summary()
    print(f"\nTotal parameters: {model.count_params():,}")
    print(f"Input shape:  {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
