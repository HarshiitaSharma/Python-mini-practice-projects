#Tip calculator


print("Welcome to the tip calculator!")
bill = float(input("What was the total bill? $"))
tip = int(input("What percentage tip would you like to give? 10 12 15 "))
people = int(input("How many people to split the bill? "))

tip_p = tip / 100
total = round((bill * (1 + tip_p)) / people, 2)

print(f"Each person should pay: ${total}")
