from __future__ import annotations

import json
import os
import sqlite3
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
SEED_PATH = BASE_DIR / "data" / "flowzint_seed.json"
DB_PATH = Path(os.getenv("FLOWPILOT_DB_PATH", BASE_DIR.parent / "flowpilot.db"))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                source TEXT NOT NULL,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS tickets (
                id TEXT PRIMARY KEY,
                customer_name TEXT NOT NULL,
                channel TEXT NOT NULL,
                message TEXT NOT NULL,
                intent TEXT NOT NULL,
                confidence REAL NOT NULL,
                response TEXT NOT NULL,
                action TEXT NOT NULL,
                priority TEXT NOT NULL,
                owner TEXT NOT NULL,
                response_time_seconds REAL NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS workflow_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id TEXT NOT NULL,
                action TEXT NOT NULL,
                reason TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )

    seed_documents()


def seed_documents() -> None:
    with SEED_PATH.open("r", encoding="utf-8") as file:
        documents = json.load(file)

    with get_connection() as conn:
        for doc in documents:
            conn.execute(
                """
                INSERT OR IGNORE INTO documents (id, title, source, category, content)
                VALUES (?, ?, ?, ?, ?)
                """,
                (doc["id"], doc["title"], doc["source"], doc["category"], doc["content"]),
            )


def add_document(doc: dict[str, str]) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO documents (id, title, source, category, content)
            VALUES (?, ?, ?, ?, ?)
            """,
            (doc["id"], doc["title"], doc["source"], doc["category"], doc["content"]),
        )


def list_documents() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM documents ORDER BY created_at DESC").fetchall()
    return [dict(row) for row in rows]


def insert_ticket(ticket: dict[str, Any], workflow_reason: str) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO tickets (
                id, customer_name, channel, message, intent, confidence, response,
                action, priority, owner, response_time_seconds
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                ticket["id"],
                ticket["customer_name"],
                ticket["channel"],
                ticket["message"],
                ticket["intent"],
                ticket["confidence"],
                ticket["response"],
                ticket["action"],
                ticket["priority"],
                ticket["owner"],
                ticket["response_time_seconds"],
            ),
        )
        conn.execute(
            "INSERT INTO workflow_logs (ticket_id, action, reason) VALUES (?, ?, ?)",
            (ticket["id"], ticket["action"], workflow_reason),
        )


def list_tickets() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM tickets ORDER BY created_at DESC").fetchall()
    return [dict(row) for row in rows]


def list_workflow_logs() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM workflow_logs ORDER BY created_at DESC LIMIT 30").fetchall()
    return [dict(row) for row in rows]
