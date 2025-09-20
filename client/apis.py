import requests
from dotenv import load_dotenv
import os

load_dotenv()
endpoint = f"http://{os.getenv("SERVER_DOMAIN")}:{os.getenv("PORT")}"

def postNewPet(name):
    try:
        payload = {'name': name}
        res = requests.post(endpoint, json=payload)
        return res
    except Exception as e:
        print(f"Client error: {e}")


def postNewEvent(id, event):
    try:
        payload = {'event': event}
        res = requests.post(f"{endpoint}/{id}", json=payload)
        return res
    except Exception as e:
        print(f"Client error: {e}")