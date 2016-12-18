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
		if card1[0] == card2[0]
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
		["1C","2C","1H","2H"].shuffle
	end

	def current_table(table_id) 
		Table.where({table_id: table_id}).first
	end

	def game_status
		table = current_table
		table[game_started] = params[:game_started]
		table.update
	end

end
