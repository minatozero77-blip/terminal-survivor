from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.progressbar import ProgressBar
import random

class TerminalGame(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 20
        self.spacing = 10

        # Status Awal
        self.integrity = 100
        self.heat = 30
        self.firewall = 50

        # Label Judul
        self.add_widget(Label(text="TERMINAL SURVIVOR OS", font_size='24sp', size_hint_y=None, height=50))

        # Progress Bar Integrity
        self.add_widget(Label(text=f"Integrity: {self.integrity}%"))
        self.integrity_bar = ProgressBar(max=100, value=self.integrity)
        self.add_widget(self.integrity_bar)

        # Progress Bar Heat
        self.add_widget(Label(text=f"CPU Heat: {self.heat}C"))
        self.heat_bar = ProgressBar(max=100, value=self.heat)
        self.add_widget(self.heat_bar)

        # Konsol Log (Tempat pesan muncul)
        self.log_label = Label(text="System Initialized...", color=(0, 1, 0, 1))
        self.add_widget(self.log_label)

        # Tombol-tombol
        btn_layout = BoxLayout(spacing=10, size_hint_y=None, height=60)
        
        scan_btn = Button(text="SCAN", on_press=self.scan_action)
        repair_btn = Button(text="REPAIR", on_press=self.repair_action)
        firewall_btn = Button(text="FIREWALL", on_press=self.firewall_action)

        btn_layout.add_widget(scan_btn)
        btn_layout.add_widget(repair_btn)
        btn_layout.add_widget(firewall_btn)
        self.add_widget(btn_layout)

    def update_ui(self, msg):
        self.log_label.text = msg
        self.integrity_bar.value = self.integrity
        self.heat_bar.value = self.heat
        if self.integrity <= 0:
            self.log_label.text = "CRITICAL FAILURE: SYSTEM HALTED"

    def scan_action(self, instance):
        self.heat += 5
        self.update_ui("Scanning sectors... All clear.")

    def repair_action(self, instance):
        if self.heat < 90:
            self.integrity = min(100, self.integrity + 15)
            self.heat += 15
            self.update_ui("Repairing core files...")
        else:
            self.update_ui("ERROR: CPU TOO HOT!")

    def firewall_action(self, instance):
        self.firewall = 100
        self.heat += 20
        self.update_ui("Firewall rebuilt to 100%")

class MainApp(App):
    def build(self):
        return TerminalGame()

if __name__ == "__main__":
    MainApp().run()