---
id: 19
name: Perceptron Learning Algorithm
topic: machine-learning
fileName: machine-learning/perceptron-learning-algorithm
---

# Perceptron Learning Algorithm

## Introduction

The Perceptron is one of the simplest neural network algorithms, yet it demonstrates the fundamental principle of how neural networks learn: **learning from mistakes through iterative weight adjustment**.

## Core Components

### 1. Training Data Structure

```python
training_data_set = [
    (array([1,0,0]), 0),  # [bias, input1, input2], desired_output
    (array([1,0,1]), 1),
    (array([1,1,0]), 1),
    (array([1,1,1]), 1),
]
```

- **Bias Neuron**: Always set to 1, acts as an offset
- **Input Features**: Binary values (0 or 1)
- **Desired Output**: What the network should predict
- This specific dataset implements the **OR logical function**

### 2. Weight Initialization

```python
w = zeros(3)  # Initialize as [0, 0, 0]
```

- Three weights correspond to: bias weight, input1 weight, input2 weight
- Starting from zero ensures reproducible results
- Weights are the "knobs" the algorithm can turn to improve predictions

### 3. The Heaviside Step Function

```python
heaviside = lambda x: 0 if x < 0 else 1
```

- Converts the weighted sum into binary output
- Creates the decision boundary at zero
- **Input**: Any real number
- **Output**: 0 or 1

## The Learning Algorithm - Step by Step

### The Core Learning Loop

```python
for i in range(iterations):
    training_data = choice(training_data_set)  # Random selection
    x = training_data[0]     # Input vector
    y = training_data[1]     # Desired output

    # Forward pass: Calculate predicted output
    y_hat = heaviside(dot(w, x))  # Weighted sum + step function

    # Error calculation
    error = y - y_hat

    # Weight update (the LEARNING!)
    w += error * x
```

### The Magic Formula: `w += error * x`

This single line is where ALL learning happens. Let's break it down with concrete examples:

## Detailed Learning Examples

### Example 1: First Training Iteration

```python
# Training data: (array([1,0,0]), 0)
# Initial weights: w = [0, 0, 0]

# Step 1: Calculate weighted sum
weighted_sum = dot(w, x) = 0*1 + 0*0 + 0*0 = 0

# Step 2: Apply step function
y_hat = heaviside(0) = 1  # Because 0 >= 0

# Step 3: Calculate error
error = y - y_hat = 0 - 1 = -1  # WRONG prediction!

# Step 4: LEARNING HAPPENS HERE!
w += error * x
w = [0, 0, 0] + (-1) * [1, 0, 0]
w = [0, 0, 0] + [-1, 0, 0]
w = [-1, 0, 0]  # WEIGHTS HAVE BEEN UPDATED!
```

**What happened?** The algorithm predicted 1 but should have predicted 0, so it **DECREASED** the weights for this input pattern.

### Example 2: Second Training Iteration

```python
# Training data: (array([1,0,1]), 1)
# Current weights: w = [-1, 0, 0]

# Step 1: Calculate weighted sum
weighted_sum = dot(w, x) = (-1)*1 + 0*0 + 0*1 = -1

# Step 2: Apply step function
y_hat = heaviside(-1) = 0  # Because -1 < 0

# Step 3: Calculate error
error = y - y_hat = 1 - 0 = 1  # WRONG prediction again!

# Step 4: LEARNING HAPPENS HERE!
w += error * x
w = [-1, 0, 0] + 1 * [1, 0, 1]
w = [-1, 0, 0] + [1, 0, 1]
w = [0, 0, 1]  # WEIGHTS UPDATED AGAIN!
```

**What happened?** The algorithm predicted 0 but should have predicted 1, so it **INCREASED** the weights for this input pattern.

## The Learning Logic Explained

### The Three Possible Scenarios

1. **Error = 1** (predicted 0, should predict 1):
   ```python
   w += 1 * x  # INCREASE weights
   ```
   The algorithm needs to make future weighted sums LARGER to push them above the threshold.

2. **Error = -1** (predicted 1, should predict 0):
   ```python
   w += (-1) * x  # DECREASE weights
   ```
   The algorithm needs to make future weighted sums SMALLER to keep them below the threshold.

3. **Error = 0** (prediction is correct):
   ```python
   w += 0 * x  # NO CHANGE to weights
   ```
   No learning needed when the prediction is correct.

### Why This Works - The Mathematical Intuition

The weighted sum `w₁×bias + w₂×input₁ + w₃×input₂` represents a decision boundary:

- **Positive sum** → predict 1
- **Negative sum** → predict 0

When the algorithm makes a mistake, it adjusts the boundary in the correct direction:

- **Too low** (should predict 1 but predicted 0): Add the input pattern to make future sums larger
- **Too high** (should predict 0 but predicted 1): Subtract the input pattern to make future sums smaller

### The Convergence Process

1. **Random mistakes**: Initially, the algorithm makes many wrong predictions
2. **Systematic improvement**: Each mistake triggers a weight adjustment in the right direction
3. **Gradual convergence**: After many iterations, the weights settle on values that correctly separate the data
4. **Perfect classification**: Eventually, all training examples are classified correctly

## Key Insights

### 1. Learning is Trial and Error
The algorithm doesn't know the "correct" weights in advance. It discovers them through systematic trial and error.

### 2. Learning is Local
Each weight update only considers one training example at a time. There's no global optimization happening.

### 3. Learning is Guaranteed
For linearly separable problems (like the OR function), the Perceptron learning algorithm is guaranteed to find a solution.

### 4. Learning is Incremental
Improvement happens gradually - one small step at a time, building on previous adjustments.

## The Complete Algorithm in Context

```python
def fit(iterations, training_data_set, w):
    errors = []
    for i in range(iterations):
        training_data = choice(training_data_set)
        x = training_data[0]
        y = training_data[1]

        # Predict
        y_hat = heaviside(dot(w, x))

        # Calculate error
        error = y - y_hat
        errors.append(error)

        # LEARN: Adjust weights based on error
        w += error * x

    return errors, w
```

## Summary

The Perceptron learning algorithm demonstrates the fundamental principle of neural network learning:

1. **Make a prediction** using current weights
2. **Calculate the error** by comparing with the desired output
3. **Adjust weights** in the direction that would have reduced the error
4. **Repeat** until all predictions are correct

The beauty lies in its simplicity: through repeated mistakes and systematic corrections, the algorithm gradually discovers the correct decision boundary without any prior knowledge of what that boundary should look like.

This basic learning principle scales up to modern deep learning - the same fundamental idea of "learn from mistakes through weight adjustment" underlies all neural network training, just with more sophisticated mathematics and architectures.