import threading
import queue
import time
import json
import apis
from consumer import kafka_consumer_thread
from ui import update_main_ui


def createPet(pets, id_to_number):
    name = input("Enter name of the new panda! (enter back to cancel) ")
    if name == "back":
        return

    res = apis.postNewPet(name)

    while res.status_code == 400:
        name = input(f"Pet name {name} already exists. Enter a new name: ")
        res = apis.postNewPet(name)
    
    if res.status_code == 201:
        print(f"Pet {name} was created!")
        petInfo = json.loads(res.text)
        petInfo['state'] = {
            'hungry': 50,
            'happy': 50,
            'sleepy': 50
        }
        curr_pet_count = len(pets) + 1
        pets[curr_pet_count] = petInfo
        id_to_number[petInfo['id']] = curr_pet_count
        print(f"ID to Number: {id_to_number}")
        print(f"Current pet counter: {curr_pet_count}")
        print(pets)


def handleNewEvent(console, pets, id_to_number):
    pet_number = input("Enter # of panda to be selected (enter back to cancel): ")
    while pet_number != "back" and pet_number.isdigit() and not 0 < int(pet_number) <= len(id_to_number):
        print("Enter a valid input!")
        pet_number = input("Enter # of panda to be selected (enter back to cancel): ")
    
    if pet_number == "back":
        return
    pet_number = int(pet_number)

    console.print("Enter...\n1 to Feed :bamboo:\n2 to Play :musical_note:\n3 to Sleep :bed:\n4 To Cancel")
    action_choice = input("Input: ")
    while not action_choice.isdigit() and 1 <= int(action_choice) <= 4:
        action_choice = input("Input: ")
    
    action_choice = int(action_choice)
    id = pets[pet_number]['id']
    match action_choice:
        case 1:
            print("feed!!")
            apis.postNewEvent(id, "feed")
        case 2:
            print("play!!")
            apis.postNewEvent(id, "play")
        case 3:
            print("sleep!!")
            apis.postNewEvent(id, "sleep")
        case 4:
            return


def processPetData():
    res = apis.getAllPetData()
    data = json.loads(res.text)
    if 'data' not in data:
        raise Exception('Invalid data received from get request.')
    elif not data:
        return {}, {}
    
    data = data['data']

    pets, id_to_number = {}, {}
    for pet_id, pet_data in data.items():
        pet_number = len(pets) + 1
        pets[pet_number] = {
            'id': pet_id,
            'name': pet_data['petName'],
            'state': pet_data['petState']
        }
        id_to_number[pet_id] = pet_number
    return pets, id_to_number


def main():
    try:
        pets, id_to_number = processPetData()
    except Exception as e:
        print(f"Client error: {e}. Proceed with empty data")
        pets, id_to_number = {}, {}

    message_queue = queue.Queue()
    stop_event = threading.Event()
    
    kafka_thread = threading.Thread(
        target=kafka_consumer_thread,
        args=(message_queue, stop_event)
    )
    kafka_thread.daemon = True
    kafka_thread.start()

    while True:
        if not message_queue.empty():
            while not message_queue.empty():
                try:
                    message_batch = message_queue.get_nowait()
                    for message in message_batch:
                        pet_number = id_to_number[message.key]
                        pets[pet_number]['state'] = message.value['petState']
                except message_queue.Empty:
                    break
        
        console = update_main_ui(pets)

        selection = input("Enter menu selection: ")
        while not selection.isdigit() or not 1 <= int(selection) <= 4:
            selection = input("Invalid input! Try again: ")
        
        match int(selection):
            case 1:
                createPet(pets, id_to_number)
            case 2:
                handleNewEvent(console, pets, id_to_number)
            case 3:
                choice = input("Are you sure you want to return all pandas to nature?\nEnter 1 for yes, 2 for no ")
            case 4:
                console.clear()
                print("Bye Bye! Shutting down...")
                stop_event.set()
                kafka_consumer_thread.join(timeout=2)
                print("Cleanup complete")
                exit()
        time.sleep(0.01) # Give time for kafka to consume new messages

main()