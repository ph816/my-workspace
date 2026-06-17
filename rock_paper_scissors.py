import random

def get_player_choice():
    while True:
        choice = input("\nEnter your choice (rock/paper/scissors): ").lower().strip()
        if choice in ['rock', 'paper', 'scissors']:
            return choice
        print("Invalid choice! Please enter rock, paper, or scissors.")

def get_computer_choice():
    return random.choice(['rock', 'paper', 'scissors'])

def determine_winner(player, computer):
    if player == computer:
        return "tie"
    
    winning_combinations = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    }
    
    if winning_combinations[player] == computer:
        return "win"
    return "lose"

def play_game():
    print("=" * 40)
    print("Welcome to Rock, Paper, Scissors!")
    print("=" * 40)
    
    score = {'wins': 0, 'losses': 0, 'ties': 0}
    
    while True:
        player_choice = get_player_choice()
        computer_choice = get_computer_choice()
        
        print(f"\nYou chose: {player_choice}")
        print(f"Computer chose: {computer_choice}")
        
        result = determine_winner(player_choice, computer_choice)
        
        if result == "win":
            print("You win this round! 🎉")
            score['wins'] += 1
        elif result == "lose":
            print("Computer wins this round! 🤖")
            score['losses'] += 1
        else:
            print("It's a tie! 🤝")
            score['ties'] += 1
        
        print(f"\nScore - Wins: {score['wins']}, Losses: {score['losses']}, Ties: {score['ties']}")
        
        play_again = input("\nPlay again? (yes/no): ").lower().strip()
        if play_again not in ['yes', 'y']:
            print("\nThanks for playing! Final Score:")
            print(f"Wins: {score['wins']}, Losses: {score['losses']}, Ties: {score['ties']}")
            break

if __name__ == "__main__":
    play_game()
