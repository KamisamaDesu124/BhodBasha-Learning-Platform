import pytest
from backend.app.core.security import verify_password, get_password_hash, create_access_token, decode_token
from backend.app.services.mastery_calc import calculate_attempt_mastery

def test_password_hashing():
    pw = "bhodbasha_stem_2026"
    hashed = get_password_hash(pw)
    assert verify_password(pw, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_jwt_token_generation_and_decoding():
    data = {"sub": "1", "role": "teacher", "email": "teacher@bhodbasha.edu"}
    token = create_access_token(data)
    decoded = decode_token(token)
    assert decoded["sub"] == "1"
    assert decoded["role"] == "teacher"
    assert decoded["email"] == "teacher@bhodbasha.edu"

def test_mastery_calculation_curve():
    # Attempt with 3 questions (easy, medium, hard), all correct
    answers_all_correct = [
        {"difficulty": "easy", "is_correct": True},
        {"difficulty": "medium", "is_correct": True},
        {"difficulty": "hard", "is_correct": True}
    ]
    mastery, imp, label = calculate_attempt_mastery(answers_all_correct)
    assert mastery == 100.0
    assert label == "Mastered"

    # Attempt with 1 correct out of 3
    answers_partial = [
        {"difficulty": "easy", "is_correct": True},
        {"difficulty": "medium", "is_correct": False},
        {"difficulty": "hard", "is_correct": False}
    ]
    mastery_part, imp_part, label_part = calculate_attempt_mastery(answers_partial)
    assert mastery_part < 50.0
    assert label_part == "Needs support"

    # Reassessment improvement comparison
    reassessment_answers = [
        {"difficulty": "easy", "is_correct": True},
        {"difficulty": "medium", "is_correct": True},
        {"difficulty": "hard", "is_correct": False}
    ]
    re_mastery, imp_val, re_label = calculate_attempt_mastery(
        reassessment_answers,
        previous_accuracy=33.3,
        has_previous_attempt=True
    )
    assert imp_val > 0.0
    assert re_label in ["Developing", "Mastered"]
