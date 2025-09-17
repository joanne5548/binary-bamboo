from rich import box
from rich.align import Align
from rich.columns import Columns
from rich.console import Console
from rich.panel import Panel


def update_main_ui(pets):
    console = Console()
    console.clear()
    if not pets:
        dashboard_content = Align.center("No pandas...", vertical="middle")
    else:
        name = pets[0]['name']
        state = pets[0]['state']
        dashboard_content = f"{0}: :panda_face: {name}\n\tㄴHungry: {state['hungry']}\n\tㄴHappy: {state['happy']}\n\tㄴSleepy: {state['sleepy']}"
    dashboard = Panel(dashboard_content, title="Dashboard", box=box.ROUNDED, width=75, height=8)

    menu_options = "1: Add a new panda\n2: Select a panda\n3: Let all panda return to nature\n4: Quit"
    menu = Panel(menu_options, title="Menu", box=box.ROUNDED, width=40, height=8)

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
