import json
from functools import lru_cache

@lru_cache(maxsize=None)
def get_file_data(filename, convert_to_json=False):
    file_data = ""
    with open(filename, "r") as file:
        file_data = file.read()
    return json.loads(file_data) if convert_to_json else file_data