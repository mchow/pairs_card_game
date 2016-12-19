class TableController < ApplicationController

	# @parmeter id of the table
	# @returns the current table state, will create a table with shuffled cards if no table exist
	def index
		table = current_table(params[:id]) 
		if table.nil?
			#create new table with ids
			current_cards = shuffle_cards
			table = Table.create({
				table_id: params[:id],
				current_cards: shuffle_cards,
				game_started: true,
				matched_cards: [] 
				})
		end
		@Table = table
	end

	# checks two cards if they are match
	# returns array of matched cards [["2H","2D"], ["3H","3C"] ... ]
	def match_cards
		card1 = params[:card1]
		card2 = params[:card2]

		table = current_table(params[:id])
		# match the first elements
		if card1.split(/D|C|S|H/)[0] == card2.split(/D|C|S|H/)[0]
			table[:matched_cards] += [card1,card2]
			table.update
		end

		render json: { matched_cards: table.matched_cards }
	end

	def current_deck
		render json: urrent_table(params[:id]).current_cards
	end

	# array of cards are denoted facecard and suite in string value 
	# 1C = one of clubs
	def shuffle_cards
		["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC", "AC", \
			"2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC", \
			"2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH", \
			"2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"].shuffle
	end

	def current_table(table_id) 
		Table.where({table_id: table_id}).first
	end

	def game_status
		table = current_table
		table[game_started] = params[:game_started]
		table.update
	end

	def app_status
		render json: Table.all
	end
end
