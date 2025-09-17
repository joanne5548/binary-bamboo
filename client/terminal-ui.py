from rich import box
from rich.columns import Columns
from rich.console import Console
from rich.align import Align
from rich.panel import Panel

no_pandas = Align.center("No pandas...", vertical="middle")
dashboard = Panel(no_pandas, title="Dashboard", box=box.ROUNDED, width=75, height=8)

menu_options = "1: Add a new panda\n2: Select a panda\n3: Let all panda return to nature\n4: Quit"
menu = Panel(menu_options, title="Menu", box=box.ROUNDED, width=40, height=8)

panels = Columns([dashboard, menu], expand=False)
main_content = Align.center(panels)

welcome_message = "[bold chartreuse2]:bamboo::panda_face: Binary Bamboo :panda_face::bamboo:[/bold chartreuse2]"
app = Panel(
    main_content,
    title=welcome_message,
    box=box.ROUNDED,
    border_style="chartreuse2",
    width=120,
)
console = Console()

if __name__ == '__main__':
    selection = 0
    while selection != 4:
        console.print(app)
        selection = int(input("Enter menu selection: "))
        print(f"You have selected: {selection}")

        match selection:
            case 1:
                name = input("Enter name of the new panda! ")
                # Make POST request :D
                # Returns name of the pet
                # print(f"Pet {created_name} was created!")
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
