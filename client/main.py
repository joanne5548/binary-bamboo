from ui import main_ui, console
import apis

if __name__ == '__main__':
    selection = 0
    while selection != 4:
        console.print(main_ui)
        selection = int(input("Enter menu selection: "))
        print(f"You have selected: {selection}")

        match selection:
            case 1:
                name = input("Enter name of the new panda! ")
                result = apis.postNewPet(name)
                # Returns name of the pet
                print(f"Pet {name} was created! Response: {result}")
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
