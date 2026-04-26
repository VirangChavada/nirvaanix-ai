#!/usr/bin/env python3
"""Minimal terminal AI agent using OpenAI Responses API."""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass, field

from openai import OpenAI


SYSTEM_PROMPT = (
    "You are a helpful AI assistant. Keep answers concise and practical unless the user asks "
    "for detail."
)


@dataclass
class Agent:
    model: str = "gpt-4.1-mini"
    system_prompt: str = SYSTEM_PROMPT
    client: OpenAI = field(default_factory=OpenAI)

    def chat(self, message: str) -> str:
        response = self.client.responses.create(
            model=self.model,
            input=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": message},
            ],
        )
        return response.output_text.strip()


def main() -> int:
    if not os.getenv("OPENAI_API_KEY"):
        print("error: set OPENAI_API_KEY in your environment", file=sys.stderr)
        return 1

    model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    agent = Agent(model=model)

    print(f"AI Agent ready (model={model}). Type 'exit' to quit.")
    while True:
        try:
            user_input = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nbye")
            return 0

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            print("bye")
            return 0

        try:
            answer = agent.chat(user_input)
        except Exception as exc:  # noqa: BLE001
            print(f"agent error: {exc}")
            continue

        print(f"agent> {answer}")


if __name__ == "__main__":
    raise SystemExit(main())
