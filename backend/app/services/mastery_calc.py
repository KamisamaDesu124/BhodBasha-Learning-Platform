from typing import List, Dict, Any, Tuple

DIFFICULTY_WEIGHTS = {
    "easy": 1.0,
    "medium": 1.5,
    "hard": 2.0
}

def calculate_attempt_mastery(
    answers: List[Dict[str, Any]],
    previous_accuracy: float = 0.0,
    has_previous_attempt: bool = False
) -> Tuple[float, float, str]:
    """
    Computes explainable AI-estimated mastery according to the BhodBasha mastery specification.
    
    Returns:
        (ai_estimated_mastery, improvement_from_previous, mastery_label)
    """
    if not answers:
        return 0.0, 0.0, "Not enough evidence"

    total_weight = 0.0
    weighted_earned = 0.0
    correct_count = 0

    for ans in answers:
        diff = ans.get("difficulty", "medium").lower()
        weight = DIFFICULTY_WEIGHTS.get(diff, 1.5)
        total_weight += weight
        if ans.get("is_correct", False):
            weighted_earned += weight
            correct_count += 1

    current_accuracy = (correct_count / len(answers)) * 100.0
    weighted_score = (weighted_earned / total_weight) * 100.0 if total_weight > 0 else 0.0

    if has_previous_attempt:
        raw_improvement = current_accuracy - previous_accuracy
        improvement_from_previous = max(0.0, min(100.0, raw_improvement))
    else:
        improvement_from_previous = 0.0

    # Composite AI-estimated mastery score
    if has_previous_attempt:
        mastery_val = 0.70 * weighted_score + 0.30 * min(100.0, previous_accuracy + improvement_from_previous)
    else:
        mastery_val = weighted_score

    mastery_val = round(max(0.0, min(100.0, mastery_val)), 1)

    # Classify label
    if len(answers) < 2:
        label = "Not enough evidence"
    elif mastery_val >= 80.0:
        label = "Mastered"
    elif mastery_val >= 50.0:
        label = "Developing"
    else:
        label = "Needs support"

    return mastery_val, round(improvement_from_previous, 1), label
