import json
import apis
from ui import update_main_ui


def createPet(pets, pet_counter):
    name = input("Enter name of the new panda! ")
    result = apis.postNewPet(name)

    while result.status_code == 400:
        name = input(f"Pet name {name} already exists. Enter a new name: ")
        result = apis.postNewPet(name)
    
    if result.status_code == 201:
        print(f"Pet {name} was created!")
        petInfo = json.loads(result.text)
        petInfo['state'] = {
            'hungry': 50,
            'happy': 50,
            'sleepy': 50
        }
        pets[pet_counter] = petInfo
        pet_counter += 1
        print(pets)


if __name__ == '__main__':
    pets = {
        # 0: {
        #     'name': 'beep boop',
        #     'state': {
        #         'hungry': 50, 'happy': 50, 'sleepy': 50
        #     }
        # },
        # 1: {
        #     'name': 'yo yo ma',
        #     'state': {
        #         'hungry': 100, 'happy': 50, 'sleepy': 50
        #     }
        # },
    }
    pet_counter = 1
    selection = 0
    while selection != 4:
        console = update_main_ui(pets)
        selection = int(input("Enter menu selection: "))

        match selection:
            case 1:
                createPet(pets, pet_counter)
            case 2:
                panda_number = input("Enter # of panda to be selected: ")
                # Keep panda number as increasing integers from 1 as a dict = {number: panda_name}
                print("")
                console.print("Enter...\n1 to Feed :tanabata_tree:\n2 to Play :musical_note:\n3 to Sleep :bed:\n4 To Cancel")
                action_choice = input("Input: ")
            case 3:
                choice = input("Are you sure you want to return all pandas to nature?\nEnter 1 for yes, 2 for no ")
            case 4:
                print("Bye Bye!")
                exit()
