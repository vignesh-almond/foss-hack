import sys
import os
import json

def say_hello():
    with open('file.txt', 'w+') as text_file:
        text_file.write("Hello from Python")

for line in sys.stdin:
	print(json.dumps(eval(line)))
