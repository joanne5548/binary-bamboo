import json
import apis
from ui import update_main_ui


def createPet(pets, pet_counter, id_to_number):
    name = input("Enter name of the new panda! ")
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
        pet_counter += 1
        pets[pet_counter] = petInfo
        id_to_number[petInfo['id']] = pet_counter
        print(pets)


def handleNewEvent(pets, pet_counter):
    pet_number = input("Enter # of panda to be selected (enter back to cancel): ")
    while pet_number != "back" and pet_number.isdigit() and int(pet_number) <= pet_counter:
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


if __name__ == '__main__':
    pets = {}
    id_to_number = {}
    pet_counter = 0
    selection = 0
    while selection != 4:
        console = update_main_ui(pets)
        selection = int(input("Enter menu selection: "))

        match selection:
            case 1:
                createPet(pets, pet_counter, id_to_number)
            case 2:
                handleNewEvent(pets, pet_counter)
            case 3:
                choice = input("Are you sure you want to return all pandas to nature?\nEnter 1 for yes, 2 for no ")
            case 4:
                print("Bye Bye!")
                exit()
