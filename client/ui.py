from rich import box
from rich.align import Align
from rich.columns import Columns
from rich.console import Console
from rich.panel import Panel

console = Console()

def update_dashboard(pets):
    if not pets:
        dashboard_content = Align.center("No pandas...", vertical="middle")
        return Panel(dashboard_content, title="Dashboard", box=box.ROUNDED, width=75, height=6)

    dashboard_content = ""
    for pet_count, pet_data in pets.items():
        name = pet_data['name']
        state = pet_data['state']
        header = f"\n:panda_face: #{pet_count}: {name}\n"
        content = f"  {"hungry":^10}  {"happy":^10}  {"sleepy":^10}\n"
        content += "  ——————————  ——————————  ——————————\n"
        content += f"  {f"{state['hungry']}%":^10}  {f"{state['happy']}%":^10}  {f"{state['happy']}%":^10}\n"
        dashboard_content += header + content
    dashboard_content = dashboard_content[1:-2]
    return Panel(dashboard_content, title="Dashboard", box=box.ROUNDED, width=75)


def update_main_ui(pets):
    console.clear()
    dashboard = update_dashboard(pets)

    menu_options = "1: Add a new panda\n2: Select a panda\n3: Let all panda return to nature\n4: Quit"
    menu = Panel(menu_options, title="Menu", box=box.ROUNDED, width=40, height=6)

    panels = Columns([dashboard, menu], expand=False)
    main_content = Align.center(panels)

    welcome_message = "[bold chartreuse2]:bamboo::panda_face: Binary Bamboo :panda_face::bamboo:[/bold chartreuse2]"
    main_ui = Panel(
        main_content,
        title=welcome_message,
        box=box.ROUNDED,
        border_style="chartreuse2",
        width=120,
    )
    console.print(main_ui)
    return console
