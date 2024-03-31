# class Vehicle():
#     def __init__(self, name, maxPassengers, maxSpeed):
#         self.name = name
#         self.maxPassengers = maxPassengers
#         self.currentSpeed = maxSpeed
        
# class LandVehicle(Vehicle):
#     def __init__(self, name, maxPassengers, maxSpeed, numWheels):
#         super().__init__(name, maxPassengers, maxSpeed)
#         self.numWheels = numWheels
#     def drive(self):
#         print("Xe đang chạy...")
        
# class SeaVessel(Vehicle):
#     def __init__(self, name, maxPassengers, maxSpeed, displacement):
#         super().__init__(name, maxPassengers, maxSpeed)
#         self.displacement = displacement
#     def launch(self):
#         print("Launch...")

# class Jeep(LandVehicle):
#     def soundHorn(self):
#         print("Sound Horn...")
        
# class Frigate(LandVehicle):
#     def fireGun(self):
#         print("Fire Gun...")
        
# class Hovercraft(LandVehicle, SeaVessel):
#     def enterLand(self):
#         print("Enter land...")
#     def enterSea(self):
#         print("Enter Sea...")
        
# if __name__ == "__main__":
#     jeep = Jeep("Jeep Wrangler", 4, 120, 4)
#     jeep.drive()  # In ra "Xe đang chạy..."
#     jeep.soundHorn()  # In ra "Sound Horn..."

#     hovercraft = Hovercraft("Hovercraft X1", 10, 60, 1000)
#     hovercraft.enterLand()  # In ra "Enter land..."
#     hovercraft.enterSea()  # In ra "Enter Sea..."



class Vehicle:
    def __init__(self, name, maxPassengers, maxSpeed):
        self.name = name
        self.maxPassengers = maxPassengers
        self.currentSpeed = maxSpeed

class LandVehicle(Vehicle):
    def __init__(self, name, maxPassengers, maxSpeed, numWheels):
        super().__init__(name, maxPassengers, maxSpeed)
        self.numWheels = numWheels

    def drive(self):
        print("Xe đang chạy...")

class SeaVessel(Vehicle):
    def __init__(self, name, maxPassengers, maxSpeed, displacement):
        super().__init__(name, maxPassengers, maxSpeed)
        self.displacement = displacement

    def launch(self):
        print("Launch...")

class Jeep(LandVehicle):
    def soundHorn(self):
        print("Sound Horn...")

class Frigate(SeaVessel):
    def fireGun(self):
        print("Fire Gun...")

class HoverCraft(LandVehicle, SeaVessel):
    def enterLand(self):
        print("Enter land...")
# class HoverCraft(SeaVessel):
    def enterSea(self):
        print("Enter Sea...")

if __name__ == "__main__":
    jeep = Jeep("Jeep Wrangler", 4, 120, 4)
    jeep.drive()  # In ra "Xe đang chạy..."
    jeep.soundHorn()  # In ra "Sound Horn..."

    hovercraft = HoverCraft("HovercraftX1", 10, 60, 1000)
    hovercraft.drive()  # In ra "Xe đang chạy..."
    hovercraft.enterLand()  # In ra "Enter land..."
    hovercraft.launch()  # In ra "Launch..."
    hovercraft.enterSea()  # In ra "Enter Sea..."ZZ