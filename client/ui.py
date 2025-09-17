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
main_ui = Panel(
    main_content,
    title=welcome_message,
    box=box.ROUNDED,
    border_style="chartreuse2",
    width=120,
)
console = Console()