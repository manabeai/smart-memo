class CreateTags < ActiveRecord::Migration[7.2]
  def change
    create_table :tags do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.timestamps
    end

    add_index :tags, [ :user, :name ], unique: true
  end
end
