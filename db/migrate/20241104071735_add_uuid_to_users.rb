class AddUuidToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_index :users, :uuid, unique: true
  end
end
