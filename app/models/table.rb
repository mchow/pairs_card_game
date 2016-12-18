class Table
  include Mongoid::Document

  field :table_id, type: Integer
  field :current_cards, type: Array
  field :matched_cards, type: Array
  field :game_started, type: Boolean 
end
