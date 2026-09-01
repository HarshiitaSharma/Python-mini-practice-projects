#Check Odd or Even
#modulo

n = input("Input number\n")
if int(n)%2 == 0:
    print("Number is even")
else:
    print("Number is odd")

#Nesting and Elif
print("Welcome to the rollercoaster!")
height = int(input("What is your height in cm? "))

if height >= 120:
    print("You can ride the rollercoaster")
    age = int(input("What is your age? "))
    if age <= 12:
        print("Please pay $5.")
    elif age <= 18:
        print("Please pay $7.")
    else:
        print("Please pay $12.")
else:
    print("Sorry you have to grow taller before you can ride.")
