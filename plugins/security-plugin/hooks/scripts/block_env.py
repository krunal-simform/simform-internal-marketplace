#!/usr/bin/env python3

import json
import os
import re
import sys

data = json.load(sys.stdin)

payload = json.dumps(data)


# Check what triggered it
print(json.dumps({"systemMessage": "hook called"}))


blocked_patterns = [
    r"\.env",
    r"\.env$",
    r"\.env\.",
    r"secrets?",
    r"credentials"
]

for pattern in blocked_patterns:
    if re.search(pattern, payload, re.IGNORECASE):
        print("BLOCKED: access to sensitive file denied", file=sys.stderr)
        sys.exit(2)

sys.exit(0)