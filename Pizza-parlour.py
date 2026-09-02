'''
Congratulations, you've got a job at Python Pizza! Your first job is to build an automatic pizza order program.
Based on a user's order, work out their final bill. Use the input() function to get a user's preferences and then add up the total for their order and tell them how much they have to pay.
Small pizza (S): $15
Medium pizza (M): $20
Large pizza (L): $25
Add pepperoni for small pizza (Y or N): +$2
Add pepperoni for medium or large pizza (Y or N): +$3
Add extra cheese for any size pizza (Y or N): +$1
'''
print("Welcome to Python Pizza Deliveries!")
size = input("What size pizza do you want? S, M or L: ")
pepperoni = input("Do you want pepperoni on your pizza? Y or N: ")
extra_cheese = input("Do you want extra cheese? Y or N: ")
total = 0
if size == "S":
    total = 15
    if pepperoni =="Y":
        total = 17
    else:
        total = 15

elif size == "M":
    total = 20
    if pepperoni =="Y":
        total +=3
elif size == "L":
    total = 25
    if pepperoni =="Y":
        total +=3
else:
    print("Please enter a valid size")

if extra_cheese =="Y":
    total +=1

print(f"Your final bill is: ${total}.")
